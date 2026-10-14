import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getStudySpace } from "@/lib/study-spaces";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/user";
import { isStudyNotes } from "@/types/study-document";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_PDF_BYTES = 6 * 1024 * 1024;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: spaceId } = await params;
  if (!uuidPattern.test(spaceId)) return NextResponse.json({ error: "invalid_space" }, { status: 400 });

  try {
    const space = await getStudySpace(user.id, spaceId);
    if (!space) return NextResponse.json({ error: "space_not_found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }

  const engineUrl = process.env.STUDYFLOW_CORE_API_URL?.replace(/\/$/, "");
  const engineToken = process.env.STUDYFLOW_CORE_API_TOKEN;
  if (!engineUrl || !engineToken) {
    return NextResponse.json({ error: "engine_not_configured" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_pdf" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file_required" }, { status: 400 });

  const filename = file.name.split(/[\\/]/).pop()?.replace(/[\u0000-\u001f]/g, "").trim() ?? "";
  if (!filename.toLowerCase().endsWith(".pdf") || filename.length > 255 || file.type !== "application/pdf") {
    return NextResponse.json({ error: "invalid_pdf" }, { status: 415 });
  }
  if (file.size === 0 || file.size > MAX_PDF_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return NextResponse.json({ error: "invalid_pdf" }, { status: 415 });
  }

  try {
    const ready = await fetch(`${engineUrl}/ready`, {
      headers: { Authorization: `Bearer ${engineToken}` },
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (ready.status === 503) {
      return NextResponse.json({ error: "model_not_configured" }, { status: 503 });
    }
    if (!ready.ok) {
      return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "analysis_failed" }, { status: 502 });
  }

  const supabase = await createClient();
  const documentId = randomUUID();
  const storagePath = `${user.id}/${spaceId}/${documentId}.pdf`;
  const { error: insertError } = await supabase.from("documents").insert({
    id: documentId,
    user_id: user.id,
    space_id: spaceId,
    filename,
    storage_path: storagePath,
    status: "processing",
  });
  if (insertError) return NextResponse.json({ error: "save_failed" }, { status: 500 });

  const fail = async (code: string, status: number) => {
    await supabase.from("documents").update({ status: "failed", error_message: code, updated_at: new Date().toISOString() }).eq("id", documentId).eq("user_id", user.id);
    return NextResponse.json({ error: code }, { status });
  };

  const { error: uploadError } = await supabase.storage.from("study-pdfs").upload(storagePath, bytes, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (uploadError) return fail("save_failed", 500);

  try {
    const engineForm = new FormData();
    engineForm.set("file", file, filename);
    const response = await fetch(`${engineUrl}/analyze`, {
      method: "POST",
      headers: { Authorization: `Bearer ${engineToken}` },
      body: engineForm,
      signal: AbortSignal.timeout(240_000),
      cache: "no-store",
    });
    if (!response.ok) {
      const code = response.status === 422 || response.status === 415
        ? "unreadable_pdf"
        : response.status === 503 ? "model_not_configured" : "analysis_failed";
      return fail(code, response.status === 503 ? 503 : 502);
    }

    const notes: unknown = await response.json();
    if (!isStudyNotes(notes)) return fail("analysis_failed", 502);

    const { error: updateError } = await supabase.from("documents").update({
      status: "completed",
      analysis: notes,
      error_message: null,
      updated_at: new Date().toISOString(),
    }).eq("id", documentId).eq("user_id", user.id);
    if (updateError) return fail("save_failed", 500);
    return NextResponse.json({ documentId }, { status: 201 });
  } catch {
    return fail("analysis_failed", 502);
  }
}
