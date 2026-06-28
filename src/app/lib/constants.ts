import type { NavLink } from "../types/portfolio";

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export const NAV_SCROLL_THRESHOLD = 40;

export const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "/journal" },
  { label: "Playground", href: "/playground" },
] satisfies readonly NavLink[];
