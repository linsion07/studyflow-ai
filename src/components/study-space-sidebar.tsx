import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StudySpace } from "@/types/study-space";

type StudySpaceSidebarProps = {
  locale: string;
  spaces: StudySpace[];
  activeSpaceId?: string;
  loadFailed?: boolean;
};

const bookIcons = ["📘", "📗", "📙"];

export async function StudySpaceSidebar({
  locale,
  spaces,
  activeSpaceId,
  loadFailed = false,
}: StudySpaceSidebarProps) {
  const t = await getTranslations({ locale, namespace: "Spaces" });

  return (
    <aside className="border-b border-slate-200 bg-slate-50/80 p-5 lg:border-b-0 lg:border-r lg:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {t("workspace")}
      </p>
      <Link
        href="/spaces"
        aria-current={activeSpaceId ? undefined : "page"}
        className={`mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
          activeSpaceId
            ? "text-slate-700 hover:bg-white hover:text-slate-950"
            : "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
        }`}
      >
        <span aria-hidden="true" className="text-base">▦</span>
        {t("allSpaces")}
      </Link>
      <div className="mt-8 flex items-center justify-between px-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {t("yourSpaces")}
        </h2>
        <span className="text-xs tabular-nums text-slate-500">{loadFailed ? "—" : spaces.length}</span>
      </div>
      <div className="mt-3 space-y-1">
        {spaces.length > 0 ? spaces.map((space, index) => (
          <Link
            key={space.id}
            href={`/spaces/${space.id}`}
            aria-current={activeSpaceId === space.id ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              activeSpaceId === space.id
                ? "bg-white font-semibold text-slate-950 shadow-sm ring-1 ring-slate-200"
                : "text-slate-700 hover:bg-white hover:text-slate-950"
            }`}
          >
            <span aria-hidden="true">{bookIcons[index % bookIcons.length]}</span>
            <span className="truncate" title={space.name}>{space.name}</span>
          </Link>
        )) : (
          <p className="px-3 py-2 text-sm text-slate-500">
            {loadFailed ? t("sidebarLoadFailed") : t("sidebarEmpty")}
          </p>
        )}
      </div>
    </aside>
  );
}
