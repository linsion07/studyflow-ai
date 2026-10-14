import { getLocale, getTranslations } from "next-intl/server";
import { signOut } from "@/app/[locale]/auth/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";
import { primaryNavigation } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/supabase/user";

export async function SiteHeader() {
  const [t, locale, user] = await Promise.all([
    getTranslations("Navbar"),
    getLocale(),
    getCurrentUser(),
  ]);

  return (
    <header className="border-b border-slate-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
          StudyFlow AI
        </Link>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <nav aria-label={t("mainNavigation")} className="flex flex-wrap items-center gap-4 text-sm font-medium sm:gap-5">
            {primaryNavigation.map((item) => (
              <Link
                key={item.labelKey}
                href={item.href}
                className="text-slate-600 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 text-sm sm:pl-6">
            {user ? (
              <>
                <span className="max-w-40 truncate text-slate-600" title={user.email ?? undefined}>
                  {user.email ?? t("account")}
                </span>
                <form action={signOut}>
                  <input type="hidden" name="locale" value={locale} />
                  <button type="submit" className="font-medium text-slate-700 hover:text-blue-700">
                    {t("logout")}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="font-medium text-slate-700 hover:text-blue-700">
                  {t("login")}
                </Link>
                <Link href="/signup" className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white transition hover:bg-slate-700">
                  {t("signup")}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
