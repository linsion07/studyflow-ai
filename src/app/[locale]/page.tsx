import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const hero = useTranslations("Hero");
  const features = useTranslations("Features");
  const pricing = useTranslations("Pricing");
  const faq = useTranslations("FAQ");

  return (
    <div>
      <section className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            {hero("eyebrow")}
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            StudyFlow AI
          </h1>
          <p className="mt-6 text-2xl font-medium text-slate-700">
            {hero("subtitle")}
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            {hero("description")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {hero("getStarted")}
            </Link>
            <Link
              href="/spaces"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {hero("viewSpaces")}
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-7 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-900">{hero("workspace")}</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {hero("comingSoon")}
            </span>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">{hero("materialsTitle")}</p>
              <p className="mt-2 text-sm text-slate-600">{hero("materialsDescription")}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">{hero("notesTitle")}</p>
              <p className="mt-2 text-sm text-slate-600">{hero("notesDescription")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-12 border-t border-slate-200 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{features("eyebrow")}</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{features("title")}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">{features("description")}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(["spaces", "notes", "flashcards"] as const).map((key) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">{features(`${key}Title`)}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{features(`${key}Description`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="scroll-mt-12 border-t border-slate-200 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{pricing("eyebrow")}</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{pricing("title")}</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">{pricing("description")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xl font-semibold text-slate-950">{pricing("previewTitle")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{pricing("previewDescription")}</p>
            <Link href="/spaces" className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
              {pricing("button")}
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-12 border-t border-slate-200 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{faq("eyebrow")}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{faq("title")}</h2>
        <div className="mt-9 divide-y divide-slate-200 border-y border-slate-200">
          {(["one", "two", "three"] as const).map((key) => (
            <details key={key} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900 marker:hidden">
                <span>{faq(`${key}Question`)}</span>
                <span aria-hidden="true" className="text-xl font-normal text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{faq(`${key}Answer`)}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
