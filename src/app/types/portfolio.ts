import type { LucideIcon } from "lucide-react";

export type ThemeMode = "light" | "dark";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export type Project = {
  num: string;
  title: string;
  year: string;
  description: string;
  challenge: string;
  stack: readonly string[];
  impact: string;
  image: string;
  imageAlt: string;
  flip: boolean;
};

export type TimelineEntry = {
  year: string;
  title: string;
  short: string;
  detail: string;
};

export type JournalArticle = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  featured: boolean;
};

export type PlaygroundItem = {
  id: number;
  title: string;
  tag: string;
  desc: string;
  image: string;
  gridClass: string;
  mobileClass: string;
};

export type AboutStat = {
  label: string;
  value: string;
};

export type CurrentlyStatusItem = {
  label: string;
  value: string;
};