import type { Metadata } from "next";

export const metadata: Metadata = { title: "Learning spaces" };

export default function SpacesPage() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
        Workspace
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        Learning spaces
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        Your subjects and study materials will live here.
      </p>
      <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-slate-900">No spaces yet</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          Space creation will be added with authentication in the next phase.
        </p>
      </div>
    </section>
  );
}
