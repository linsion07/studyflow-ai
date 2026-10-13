import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Spaces" });
  return { title: t("title") };
}

export default function SpacesPage() {
  const t = useTranslations("Spaces");

  return (
    <section className="py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        {t("description")}
      </p>
      <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-slate-900">{t("emptyTitle")}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          {t("emptyDescription")}
        </p>
      </div>
    </section>
  );
}
