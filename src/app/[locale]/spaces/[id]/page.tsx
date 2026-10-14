import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { StudySpaceSidebar } from "@/components/study-space-sidebar";
import { UploadPdfDialog } from "@/components/upload-pdf-dialog";
import { Link } from "@/i18n/navigation";
import { getSpaceDocuments } from "@/lib/documents";
import { getStudySpace, getStudySpaces } from "@/lib/study-spaces";
import { getCurrentUser } from "@/lib/supabase/user";
import type { StudyDocumentSummary } from "@/types/study-document";

type Props = { params: Promise<{ locale: string; id: string }> };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Spaces" });
  return { title: t("spaceDetailsTitle") };
}

export default async function StudySpacePage({ params }: Props) {
  const { locale, id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/" + locale + "/login");
  if (!uuidPattern.test(id)) notFound();

  const t = await getTranslations({ locale, namespace: "Spaces" });
  let space;
  let spaces;
  try {
    [space, spaces] = await Promise.all([getStudySpace(user.id, id), getStudySpaces(user.id)]);
  } catch {
    return (
      <div role="alert" className="my-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {t("loadFailed")}
      </div>
    );
  }
  if (!space) notFound();

  let documents: StudyDocumentSummary[] = [];
  let documentsFailed = false;
  try {
    documents = await getSpaceDocuments(user.id, id);
  } catch {
    documentsFailed = true;
  }

  const createdAt = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(space.created_at));

  return (
    <section className="py-8 sm:py-12">
      <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[245px_minmax(0,1fr)]">
        <StudySpaceSidebar locale={locale} spaces={spaces} activeSpaceId={space.id} />

        <div className="min-w-0 p-6 sm:p-9 lg:p-12">
          <Link href="/spaces" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
            <span aria-hidden="true">←</span>
            {t("backToSpaces")}
          </Link>

          <div className="mt-7 flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{t("eyebrow")}</p>
              <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {space.name}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {space.description || t("spaceIntro")}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {t("createdAt")} <time dateTime={space.created_at}>{createdAt}</time>
              </p>
            </div>
            <UploadPdfDialog spaceId={space.id} />
          </div>

          <nav aria-label={t("spaceSections")} className="mt-7 flex flex-wrap gap-2">
            <a href="#notes" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-950">{t("notes")}</a>
            <a href="#flashcards" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-950">{t("flashcards")}</a>
            <a href="#quiz" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-950">{t("quiz")}</a>
          </nav>

          <section id="notes" className="mt-8 scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-950">{t("notes")}</h2>
              {!documentsFailed && <span className="text-xs font-medium text-slate-500">{t("documentCount", { count: documents.length })}</span>}
            </div>
            {documentsFailed ? (
              <p role="alert" className="mt-3 text-sm text-red-700">{t("documentsFailed")}</p>
            ) : documents.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">{t("notesEmpty")}</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {documents.map((document) => (
                  <li key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950" title={document.filename}>{document.filename}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        <time dateTime={document.created_at}>{new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(new Date(document.created_at))}</time>
                        {" · "}{t(`documentStatus.${document.status === "completed" && !document.verified_ai ? "unverified" : document.status}`)}
                      </p>
                    </div>
                    {document.status === "completed" && (
                      <Link href={`/spaces/${space.id}/notes/${document.id}`} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">{t("openNotes")}</Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <section id="flashcards" className="scroll-mt-24 rounded-2xl border border-slate-200 p-6">
              <div aria-hidden="true" className="text-2xl">▤</div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{t("flashcards")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t("flashcardsEmpty")}</p>
              <p className="mt-4 text-xs font-medium text-slate-500">{t("comingSoon")}</p>
            </section>
            <section id="quiz" className="scroll-mt-24 rounded-2xl border border-slate-200 p-6">
              <div aria-hidden="true" className="text-2xl">✓</div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{t("quiz")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t("quizEmpty")}</p>
              <p className="mt-4 text-xs font-medium text-slate-500">{t("comingSoon")}</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
