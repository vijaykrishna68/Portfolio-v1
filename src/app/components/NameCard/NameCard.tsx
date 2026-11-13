import { Link } from "react-router";
import { Globe, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CONTACT_EMAIL, PORTRAIT_SRC, SOCIAL_LINKS } from "../../content/site";
import { THEME_MODES } from "../../lib/constants";
import type { ThemeMode } from "../../types/portfolio";

export const SITE_URL = "https://portfolio-v1-blush-eight.vercel.app";

type CardLink = {
  name: string;
  detail: string;
  href: string;
  icon: LucideIcon;
  internal?: boolean;
};

function detailFor(href: string): string {
  if (href.startsWith("mailto:")) return href.slice(7);
  const url = new URL(href);
  const path = url.pathname.replace(/\/$/, "");
  return url.host.replace(/^www\./, "") + (url.host.includes("drive.") ? "" : path);
}

// Order and platform names are fixed here; hrefs and icons come from SOCIAL_LINKS.
const ORDER = [
  { match: CONTACT_EMAIL, name: "Email" },
  { match: "LinkedIn", name: "LinkedIn" },
  { match: "GitHub", name: "GitHub" },
  { match: "Resume", name: "Resume" },
] as const;

function buildLinks(): CardLink[] {
  const links: CardLink[] = [];
  for (const { match, name } of ORDER) {
    const found = SOCIAL_LINKS.find((s) => s.label === match);
    if (found) links.push({ name, detail: detailFor(found.href), href: found.href, icon: found.icon });
  }
  links.push({ name: "Portfolio", detail: new URL(SITE_URL).host, href: "/", icon: Globe, internal: true });
  return links;
}

const LINKS = buildLinks();

const ROW =
  "flex items-center gap-4 min-h-[56px] px-4 border border-border bg-card text-foreground " +
  "hover:border-[#68b1f5] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#68b1f5] transition-colors duration-200";

const STYLES = `
.nc-screen{min-height:100vh;min-height:100dvh}
@keyframes nc-in{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:no-preference){.nc-in{animation:nc-in .4s ease-out both}}
`;

type Props = { theme: ThemeMode; toggleTheme: () => void };

export function NameCard({ theme, toggleTheme }: Props) {
  return (
    <div className="nc-screen bg-background text-foreground">
      <style>{STYLES}</style>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-2 right-2 z-10 inline-flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#68b1f5]"
      >
        {theme === THEME_MODES.DARK ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
      </button>

      <main className="nc-in mx-auto flex w-full max-w-[440px] flex-col px-5 pt-8 pb-8">
        <div className="flex flex-col items-center text-center">
          {PORTRAIT_SRC && (
            <img
              src={PORTRAIT_SRC}
              alt="Portrait of Vijay Krishna"
              width={84}
              height={84}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-[84px] w-[84px] rounded-full bg-muted object-cover object-top"
            />
          )}
          <h1 className="mt-4 text-[34px] leading-none" style={{ fontFamily: "var(--font-display)" }}>
            Vijay Krishna
          </h1>
          <p className="mt-3 text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            Full Stack Engineer <span className="text-[#68b1f5]">·</span> Open to Freelance Work
          </p>
          <p className="mt-5 text-[17px] text-foreground/80">Good to meet you.</p>
        </div>

        <ul className="mt-5 flex flex-col gap-2">
          {LINKS.map(({ name, detail, href, icon: Icon, internal }) => (
            <li key={name}>
              {internal ? (
                <Link to={href} className={ROW}>
                  <Icon size={20} strokeWidth={1.5} className="shrink-0 text-[#68b1f5]" aria-hidden="true" />
                  <RowText name={name} detail={detail} />
                </Link>
              ) : (
                <a href={href} target="_blank" rel="noopener noreferrer" className={ROW}>
                  <Icon size={20} strokeWidth={1.5} className="shrink-0 text-[#68b1f5]" aria-hidden="true" />
                  <RowText name={name} detail={detail} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function RowText({ name, detail }: { name: string; detail: string }) {
  return (
    <span className="min-w-0 py-2">
      <span className="block text-[15px] font-medium leading-tight">{name}</span>
      <span
        className="block truncate text-[12px] leading-tight text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {detail}
      </span>
    </span>
  );
}
