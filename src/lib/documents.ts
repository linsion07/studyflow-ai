import { createClient } from "@/lib/supabase/server";
import type { StudyDocument, StudyDocumentSummary } from "@/types/study-document";

export async function getSpaceDocuments(userId: string, spaceId: string): Promise<StudyDocumentSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, filename, status, created_at, analysis")
    .eq("user_id", userId)
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load documents.", { cause: error });
  return (data ?? []).map((document) => ({
    id: document.id,
    filename: document.filename,
    status: document.status,
    created_at: document.created_at,
    verified_ai: isVerifiedAiResult(document.analysis),
  })) as StudyDocumentSummary[];
}

function isVerifiedAiResult(analysis: unknown): boolean {
  return Boolean(analysis && typeof analysis === "object" &&
    (analysis as Record<string, unknown>).generation_mode === "ai");
}

export async function getSpaceDocument(userId: string, spaceId: string, documentId: string): Promise<StudyDocument | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, user_id, space_id, filename, status, analysis, error_message, created_at")
    .eq("id", documentId)
    .eq("user_id", userId)
    .eq("space_id", spaceId)
    .maybeSingle();

  if (error) throw new Error("Unable to load document.", { cause: error });
  return data as StudyDocument | null;
}
