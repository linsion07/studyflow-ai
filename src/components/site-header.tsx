import Link from "next/link";
import { primaryNavigation } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
          StudyFlow AI
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 text-sm font-medium">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-600 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
