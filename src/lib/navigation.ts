import type { NavigationItem } from "@/types/navigation";

export const primaryNavigation: readonly NavigationItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/#features", labelKey: "features" },
  { href: "/#pricing", labelKey: "pricing" },
  { href: "/#faq", labelKey: "faq" },
  { href: "/spaces", labelKey: "spaces" },
];
