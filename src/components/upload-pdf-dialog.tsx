"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";

const MAX_PDF_BYTES = 6 * 1024 * 1024;

export function UploadPdfDialog({ spaceId }: { spaceId: string }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Upload");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span aria-hidden="true">＋</span>
        {t("button")}
      </button>
      {open && <UploadModal spaceId={spaceId} onClose={() => setOpen(false)} />}
    </>
  );
}

function UploadModal({ spaceId, onClose }: { spaceId: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Upload");
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return setError(t("fileRequired"));
    if (file.size > MAX_PDF_BYTES) return setError(t("fileTooLarge"));
    if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") {
      return setError(t("invalidPdf"));
    }

    setPending(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch(`/api/spaces/${spaceId}/documents`, { method: "POST", body: form });
      const result: { documentId?: string; error?: string } = await response.json();
      if (!response.ok || !result.documentId) {
        const messages: Record<string, string> = {
          unauthorized: t("unauthorized"),
          file_required: t("fileRequired"),
          file_too_large: t("fileTooLarge"),
          invalid_pdf: t("invalidPdf"),
          unreadable_pdf: t("unreadablePdf"),
          engine_not_configured: t("engineNotConfigured"),
          model_not_configured: t("modelNotConfigured"),
          analysis_failed: t("analysisFailed"),
          save_failed: t("saveFailed"),
        };
        setError(messages[result.error ?? ""] ?? t("generalError"));
        return;
      }
      dialogRef.current?.close();
      router.push(`/${locale}/spaces/${spaceId}/notes/${result.documentId}`);
      router.refresh();
    } catch {
      setError(t("generalError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(event) => { if (pending) event.preventDefault(); }}
      aria-labelledby="upload-pdf-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/50"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="upload-pdf-title" className="text-xl font-semibold tracking-tight">{t("title")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t("description")}</p>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => dialogRef.current?.close()}
            aria-label={t("close")}
            className="rounded-lg px-2 py-1 text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >×</button>
        </div>

        <form onSubmit={submit} className="mt-6">
          <label htmlFor="study-pdf" className="block text-sm font-medium text-slate-800">{t("fileLabel")}</label>
          <input
            id="study-pdf"
            type="file"
            accept=".pdf,application/pdf"
            required
            disabled={pending}
            onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(null); }}
            className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-medium file:text-slate-800"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">{t("limits")}</p>
          {pending && <p role="status" className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{t("processing")}</p>}
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="mt-7 flex justify-end gap-3">
            <button type="button" disabled={pending} onClick={() => dialogRef.current?.close()} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50">{t("cancel")}</button>
            <button type="submit" disabled={pending} className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">{pending ? t("processingButton") : t("submit")}</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
