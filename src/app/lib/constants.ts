import { FileText, Github, Linkedin, Mail } from "lucide-react";

import type { NavLink, SocialLink } from "../types/portfolio";

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export const NAV_SCROLL_THRESHOLD = 40;

export const ANIMATION_DURATIONS = {
  quick: "duration-200",
  standard: "duration-300",
  slow: "duration-500",
  hero: "duration-700",
} as const;

export const CONTACT_EMAIL = "vijay@example.com";

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Timeline", href: "#timeline" },
  { label: "Journal", href: "#journal" },
  { label: "Playground", href: "#playground" },
  { label: "About", href: "#about" },
] satisfies readonly NavLink[];

export const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Mail, label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: FileText, label: "Resume", href: "#" },
] satisfies readonly SocialLink[];