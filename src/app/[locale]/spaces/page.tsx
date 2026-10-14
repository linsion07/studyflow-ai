import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { NewStudySpaceDialog } from "@/components/new-study-space-dialog";
import { StudySpaceSidebar } from "@/components/study-space-sidebar";
import { Link } from "@/i18n/navigation";
import { getStudySpaces } from "@/lib/study-spaces";
import { getCurrentUser } from "@/lib/supabase/user";
import type { StudySpace } from "@/types/study-space";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Spaces" });
  return { title: t("title") };
}

export default async function SpacesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const t = await getTranslations({ locale, namespace: "Spaces" });
  let spaces: StudySpace[] = [];
  let loadFailed = false;
  try {
    spaces = await getStudySpaces(user.id);
  } catch {
    loadFailed = true;
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const bookIcons = ["📘", "📗", "📙"];

  return (
    <section className="py-8 sm:py-12">
      <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[245px_minmax(0,1fr)]">
        <StudySpaceSidebar locale={locale} spaces={spaces} loadFailed={loadFailed} />

        <div className="min-w-0 p-6 sm:p-9 lg:p-12">
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                {t("eyebrow")}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {t("welcomeBack", { name: user.name ?? t("student") })}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                {t("description")}
              </p>
            </div>
            <NewStudySpaceDialog />
          </div>

          <div className="mt-9 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{t("title")}</h2>
              {!loadFailed && <p className="mt-1 text-sm text-slate-500">{t("spaceCount", { count: spaces.length })}</p>}
            </div>
          </div>

          {loadFailed ? (
            <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              {t("loadFailed")}
            </div>
          ) : spaces.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
              <div aria-hidden="true" className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                📚
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{t("emptyTitle")}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
                {t("emptyDescription")}
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {spaces.map((space, index) => (
                <li key={space.id}>
                  <Link
                    href={"/spaces/" + space.id}
                    className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <div aria-hidden="true" className="flex size-11 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                      {bookIcons[index % bookIcons.length]}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <h3 className="truncate text-base font-semibold text-slate-950" title={space.name}>
                        {space.name}
                      </h3>
                      <span aria-hidden="true" className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-950">↗</span>
                    </div>
                    {space.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{space.description}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-500">
                      {t("createdAt")}{" "}
                      <time dateTime={space.created_at}>{dateFormatter.format(new Date(space.created_at))}</time>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
