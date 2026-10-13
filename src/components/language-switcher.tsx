"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const languages = [
  { locale: "en", name: "English", description: "English" },
  { locale: "zh", name: "中文", description: "Chinese" },
  { locale: "ja", name: "日本語", description: "Japanese" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LanguageSwitcher");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const currentLanguage = languages.find((language) => language.locale === locale);
  const visibleLanguages = languages.filter((language) =>
    `${language.name} ${language.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  function openDialog() {
    setQuery("");
    dialogRef.current?.showModal();
    setIsOpen(true);
    searchRef.current?.focus();
  }

  function changeLanguage(nextLocale: (typeof routing.locales)[number]) {
    dialogRef.current?.close();
    if (nextLocale !== locale) {
      startTransition(() => router.replace(pathname, { locale: nextLocale }));
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={`${t("label")}: ${currentLanguage?.name ?? locale}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        disabled={isPending}
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.7 2.5 4 5.5 4 9s-1.3 6.5-4 9c-2.7-2.5-4-5.5-4-9s1.3-6.5 4-9Z" />
        </svg>
        <span>{currentLanguage?.name ?? locale}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3">
          <path d="m4 7 6 6 6-6" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="language-dialog-title"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            dialogRef.current?.close();
          }
        }}
        className="fixed top-20 right-4 left-auto m-0 hidden h-[min(30rem,calc(100dvh-6rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#202124] p-0 text-white shadow-2xl backdrop:bg-black/65 open:flex sm:right-8"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 id="language-dialog-title" className="text-base font-semibold">{t("title")}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={t("close")}
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
              <path d="M4 4l12 12M16 4 4 16" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {visibleLanguages.length > 0 ? (
            <div className="space-y-1">
              {visibleLanguages.map((language) => (
                <button
                  key={language.locale}
                  type="button"
                  aria-pressed={locale === language.locale}
                  onClick={() => changeLanguage(language.locale)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>
                    <span className="block text-sm font-semibold">{language.name}</span>
                    <span className="mt-1 block text-xs text-white/55">{language.description}</span>
                  </span>
                  {locale === language.locale && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                      <span className="sr-only">{t("selected")}</span>
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                        <path d="m4 10 4 4 8-8" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 py-6 text-sm text-white/60">{t("noResults")}</p>
          )}
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 focus-within:outline-2 focus-within:outline-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0 text-white/60">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t("search")}
              placeholder={t("search")}
              className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
