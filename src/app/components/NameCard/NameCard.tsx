import { Link } from "react-router";
import { Download, Globe, Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CONTACT_EMAIL, SOCIAL_LINKS } from "../../content/site";
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

const CARD_PORTRAIT_SRC = "/portrait-card.jpg";

const STYLES = `
.nc-screen{min-height:100vh;min-height:100dvh}
.nc-block{border:2px solid var(--foreground);border-radius:2px;box-shadow:6px 6px 0 var(--foreground);color:var(--foreground)}
.nc-row{display:flex;align-items:center;gap:14px;min-height:56px;padding:8px 12px;background:var(--card);transition:transform 120ms ease-out,box-shadow 120ms ease-out}
.nc-row-yellow{background:var(--signal);color:var(--accent-foreground)}
.nc-tile{display:flex;flex:none;align-items:center;justify-content:center;width:40px;height:40px;background:var(--background);color:var(--foreground);border:2px solid var(--foreground);border-radius:2px;box-shadow:3px 3px 0 var(--foreground)}
.nc-row:focus-visible,.nc-toggle:focus-visible{outline:3px solid var(--foreground);outline-offset:3px}
.nc-row:active{transform:translate(4px,4px);box-shadow:2px 2px 0 var(--foreground)}
@media (hover:hover){
.nc-row:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--foreground)}
.nc-row:hover:active{transform:translate(4px,4px);box-shadow:2px 2px 0 var(--foreground)}
}
@keyframes nc-in{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:no-preference){.nc-in{animation:nc-in .4s ease-out both}}
@media (prefers-reduced-motion:reduce){.nc-row{transition:none}.nc-row:hover,.nc-row:active,.nc-row:hover:active{transform:none}}
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
        className="nc-toggle fixed top-2 right-2 z-10 inline-flex h-11 w-11 items-center justify-center text-foreground"
      >
        {theme === THEME_MODES.DARK ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      </button>

      <main className="nc-in mx-auto flex w-full max-w-[460px] flex-col pl-5 pr-7 pt-8 pb-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-[128px] w-[96px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 border-2 border-foreground bg-signal"
              style={{ transform: "translate(8px, 8px)", borderRadius: 2 }}
            />
            <img
              src={CARD_PORTRAIT_SRC}
              alt="Portrait of Vijay Krishna"
              width={480}
              height={640}
              loading="eager"
              decoding="async"
              className="relative h-full w-full border-2 border-foreground bg-muted object-cover object-top"
              style={{ borderRadius: 2 }}
            />
          </div>
          <h1 className="mt-6 text-[34px] leading-none" style={{ fontFamily: "var(--font-display)" }}>
            Vijay Krishna
          </h1>
          <p className="mt-3 text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            Full Stack Engineer · Open to Freelance Work
          </p>
          <p
            className="nc-block mt-5 inline-block bg-signal px-3 py-1.5 text-[15px] font-medium"
            style={{ boxShadow: "4px 4px 0 var(--foreground)", color: "var(--accent-foreground)" }}
          >
            Good to meet you.
          </p>
        </div>

        <ul className="mt-6 flex flex-col gap-4">
          {LINKS.map(({ name, detail, href, icon: Icon, internal }) => {
            const inner = (
              <>
                <span className="nc-tile">
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 py-1">
                  <span className="block text-[15px] font-medium leading-tight">{name}</span>
                  <span className="block truncate text-[12px] leading-tight" style={{ fontFamily: "var(--font-mono)" }}>
                    {detail}
                  </span>
                </span>
              </>
            );
            return (
              <li key={name}>
                {internal ? (
                  <Link to={href} className="nc-block nc-row">{inner}</Link>
                ) : (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="nc-block nc-row">{inner}</a>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href="/vijay-krishna.vcf"
          download="vijay-krishna.vcf"
          className="nc-block nc-row nc-row-yellow mt-5"
        >
          <span className="nc-tile">
            <Download size={20} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium">Save contact</span>
        </a>
      </main>
    </div>
  );
}
