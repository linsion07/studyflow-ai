import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
      <div className="max-w-2xl">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
          Your place to learn
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          StudyFlow AI
        </h1>
        <p className="mt-6 text-2xl font-medium text-slate-700">
          AI-powered learning workspace
        </p>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
          Bring your study materials together and turn them into clearer notes
          and useful flashcards as StudyFlow grows.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Get started
          </Link>
          <Link
            href="/spaces"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            View learning spaces
          </Link>
        </div>
      </div>
      <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-7 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">Workspace</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Coming together
          </span>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Study materials</p>
            <p className="mt-2 text-sm text-slate-600">Keep each subject in one space.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Notes and flashcards</p>
            <p className="mt-2 text-sm text-slate-600">Review the ideas that matter.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
