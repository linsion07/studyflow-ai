"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createStudySpace } from "@/app/[locale]/spaces/actions";

export function NewStudySpaceDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Spaces");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span aria-hidden="true" className="text-lg leading-none">+</span>
        {t("newSpace")}
      </button>
      {open && <StudySpaceModal onClose={() => setOpen(false)} />}
    </>
  );
}

function StudySpaceModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Spaces");
  const [state, action, pending] = useActionState(createStudySpace, {});

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  useEffect(() => {
    if (state.success) {
      dialogRef.current?.close();
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/50"
      aria-labelledby="new-space-title"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="new-space-title" className="text-xl font-semibold tracking-tight">
              {t("newSpace")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t("modalDescription")}</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t("close")}
            className="rounded-lg px-2 py-1 text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            ×
          </button>
        </div>
        <form action={action} className="mt-6">
          <input type="hidden" name="locale" value={locale} />
          <label htmlFor="space-name" className="block text-sm font-medium text-slate-800">
            {t("spaceName")}
          </label>
          <input
            id="space-name"
            name="name"
            type="text"
            required
            maxLength={80}
            autoFocus
            placeholder={t("namePlaceholder")}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {state.error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {t(state.error)}
            </p>
          )}
          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? t("creating") : t("createSpace")}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
