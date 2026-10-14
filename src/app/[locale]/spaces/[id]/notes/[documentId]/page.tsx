import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { StudySpaceSidebar } from "@/components/study-space-sidebar";
import { Link } from "@/i18n/navigation";
import { getSpaceDocument } from "@/lib/documents";
import { getStudySpace, getStudySpaces } from "@/lib/study-spaces";
import { getCurrentUser } from "@/lib/supabase/user";
import { isStudyNotes } from "@/types/study-document";

type Props = { params: Promise<{ locale: string; id: string; documentId: string }> };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "StudyNotes" });
  return { title: t("pageTitle") };
}

export default async function StudyNotesPage({ params }: Props) {
  const { locale, id, documentId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (!uuidPattern.test(id) || !uuidPattern.test(documentId)) notFound();

  const t = await getTranslations({ locale, namespace: "StudyNotes" });
  let space;
  let spaces;
  let document;
  try {
    [space, spaces, document] = await Promise.all([
      getStudySpace(user.id, id),
      getStudySpaces(user.id),
      getSpaceDocument(user.id, id, documentId),
    ]);
  } catch {
    return <p role="alert" className="my-12 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{t("loadFailed")}</p>;
  }
  if (!space || !document) notFound();

  const notes = isStudyNotes(document.analysis) ? document.analysis : null;
  const date = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(new Date(document.created_at));

  return (
    <section className="py-8 sm:py-12">
      <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[245px_minmax(0,1fr)]">
        <StudySpaceSidebar locale={locale} spaces={spaces} activeSpaceId={space.id} />
        <article className="min-w-0 p-6 sm:p-9 lg:p-12">
          <Link href={`/spaces/${space.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"><span aria-hidden="true">←</span>{t("backToSpace")}</Link>
          <header className="mt-7 border-b border-slate-200 pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{t("eyebrow")}</p>
            <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{notes?.title || document.filename}</h1>
            <p className="mt-3 break-all text-sm text-slate-500">{document.filename} · <time dateTime={document.created_at}>{date}</time></p>
          </header>

          {document.status === "failed" ? (
            <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{t("analysisFailed")}</div>
          ) : document.status === "processing" ? (
            <div role="status" className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-800">{t("processing")}</div>
          ) : !notes ? (
            <div role="alert" className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">{t("unverifiedResult")}</div>
          ) : (
            <div className="space-y-8 pt-8">
              <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 sm:p-7">
                <h2 className="text-lg font-semibold text-slate-950">{t("summary")}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{notes.summary || t("emptySection")}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-950">{t("chapters")}</h2>
                {notes.chapters.length ? (
                  <ol className="mt-4 space-y-3">
                    {notes.chapters.map((chapter, index) => (
                      <li key={`${chapter.title}-${index}`} className="rounded-xl border border-slate-200 p-4" style={{ marginLeft: `${Math.min(Math.max(chapter.level - 1, 0), 3) * 12}px` }}>
                        <h3 className="font-semibold text-slate-950">{chapter.title}</h3>
                        {chapter.summary && <p className="mt-2 text-sm leading-6 text-slate-600">{chapter.summary}</p>}
                      </li>
                    ))}
                  </ol>
                ) : <p className="mt-3 text-sm text-slate-500">{t("emptySection")}</p>}
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-950">{t("keyPoints")}</h2>
                {notes.key_points.length ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {notes.key_points.map((point, index) => (
                      <li key={`${point.topic}-${index}`} className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="font-semibold text-slate-950">{point.topic}</h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{point.detail}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-3 text-sm text-slate-500">{t("emptySection")}</p>}
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-950">{t("formulas")}</h2>
                {notes.formulas.length ? (
                  <ul className="mt-4 space-y-3">
                    {notes.formulas.map((formula, index) => (
                      <li key={`${formula.name}-${index}`} className="rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-800">{formula.name}</h3>
                        <code className="mt-2 block overflow-x-auto whitespace-pre-wrap break-words text-sm text-slate-950">{formula.formula}</code>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-3 text-sm text-slate-500">{t("emptySection")}</p>}
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-950">{t("examFocus")}</h2>
                {notes.exam_focus.length ? (
                  <ul className="mt-4 space-y-3">
                    {notes.exam_focus.map((focus, index) => (
                      <li key={`${focus.topic}-${index}`} className="rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-950">{focus.topic}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{focus.reason}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-3 text-sm text-slate-500">{t("emptySection")}</p>}
              </section>

              <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{t("flashcards")}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t("flashcardsDescription", { count: notes.flashcards.length })}</p>
                </div>
                <a href="#flashcards" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{t("flashcardsLink")}</a>
              </section>

              <section id="flashcards" className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-slate-950">{t("flashcards")}</h2>
                {notes.flashcards.length ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {notes.flashcards.map((card, index) => (
                      <li key={`${card.question}-${index}`} className="rounded-xl border border-slate-200 p-5">
                        <h3 className="font-semibold text-slate-950">{card.question}</h3>
                        <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">{card.answer}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-3 text-sm text-slate-500">{t("emptySection")}</p>}
              </section>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
