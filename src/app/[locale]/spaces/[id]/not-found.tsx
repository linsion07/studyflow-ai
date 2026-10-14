import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function StudySpaceNotFound() {
  const t = await getTranslations("Spaces");

  return (
    <section className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t("notFoundTitle")}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{t("notFoundDescription")}</p>
      <Link href="/spaces" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        {t("backToSpaces")}
      </Link>
    </section>
  );
}
