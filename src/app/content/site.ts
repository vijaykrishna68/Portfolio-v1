import { FileText, Github, Linkedin, Mail } from "lucide-react";

import type { AboutStat, CurrentlyStatusItem, SocialLink } from "../types/portfolio";

export const aboutStats = [
  { label: "Languages", value: "Go · Python · Rust" },
  { label: "Currently reading", value: "DDIA, 2nd Ed." },
  { label: "Based in", value: "Bengaluru, India" },
] satisfies readonly AboutStat[];

export const CURRENTLY_ITEMS = [
  { label: "Currently building", value: "AI Email Workflow" },
  { label: "Currently learning", value: "Spring Boot" },
  { label: "Currently exploring", value: "PostgreSQL Internals" },
  { label: "Currently reading", value: "Designing Data Intensive Applications" },
] satisfies readonly CurrentlyStatusItem[];

export const CONTACT_EMAIL = "vijay@example.com";

export const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Mail, label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: FileText, label: "Resume", href: "#" },
] satisfies readonly SocialLink[];