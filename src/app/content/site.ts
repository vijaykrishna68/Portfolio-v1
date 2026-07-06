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

export const CONTACT_EMAIL = "vijaykrishna.officialid@gmail.com";

// Portrait image shown beside the About text on desktop.
// Place your photo at public/portrait.jpg and set this to "/portrait.jpg".
// Leave empty ("") to hide the portrait slot.
export const PORTRAIT_SRC = "/portait.jpg";
export const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "https://github.com/vijaykrishna68" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/contact-vijay-krishna/" },
  { icon: Mail, label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: FileText, label: "Resume", href: "https://drive.google.com/file/d/1HB-grRk-lIZqKmLckbGesmXflZGetyt8/view?usp=drive_link" },
] satisfies readonly SocialLink[];