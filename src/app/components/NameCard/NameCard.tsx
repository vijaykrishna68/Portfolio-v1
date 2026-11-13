import { Download, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CONTACT_EMAIL, SOCIAL_LINKS } from "../../content/site";

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
.nc-screen{min-height:100vh;min-height:100dvh;--nc-edge:var(--foreground);--nc-shadow:var(--foreground);--nc-hi-edge:var(--foreground);--nc-hi-shadow:var(--foreground);--nc-ybd:var(--foreground);--nc-pt-shadow:0 0 0 transparent}
.dark .nc-screen{--nc-edge:#757274;--nc-edge:color-mix(in srgb,var(--foreground) 45%,var(--background));--nc-shadow:var(--nc-edge);--nc-hi-shadow:var(--signal);--nc-ybd:var(--accent-foreground);--nc-pt-shadow:4px 4px 0 var(--nc-edge)}
.nc-block{border:2px solid var(--nc-edge);border-radius:2px;box-shadow:6px 6px 0 var(--nc-shadow);color:var(--foreground)}
.nc-row{display:flex;align-items:center;gap:14px;min-height:56px;padding:8px 12px;background:var(--card);transition:transform 120ms ease-out,box-shadow 120ms ease-out,border-color 120ms ease-out}
.nc-row-yellow{background:var(--signal);color:var(--accent-foreground);--nc-edge:var(--nc-ybd);--nc-hi-edge:var(--nc-ybd);--nc-hi-shadow:var(--foreground)}
.nc-tile{display:flex;flex:none;align-items:center;justify-content:center;width:40px;height:40px;background:var(--background);color:var(--foreground);border:2px solid var(--nc-edge);border-radius:2px;box-shadow:3px 3px 0 var(--nc-shadow)}
.nc-row:focus-visible,.nc-toggle:focus-visible{outline:3px solid var(--foreground);outline-offset:3px}
.nc-row:focus-visible{border-color:var(--nc-hi-edge);box-shadow:6px 6px 0 var(--nc-hi-shadow)}
.nc-row:active{transform:translate(4px,4px);border-color:var(--nc-hi-edge);box-shadow:2px 2px 0 var(--nc-hi-shadow)}
@media (hover:hover){
.nc-row:hover{transform:translate(-2px,-2px);border-color:var(--nc-hi-edge);box-shadow:8px 8px 0 var(--nc-hi-shadow)}
.nc-row:hover:active{transform:translate(4px,4px);border-color:var(--nc-hi-edge);box-shadow:2px 2px 0 var(--nc-hi-shadow)}
}
@keyframes nc-in{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:no-preference){.nc-in{animation:nc-in .4s ease-out both}}
@media (prefers-reduced-motion:reduce){.nc-row{transition:none}.nc-row:hover,.nc-row:active,.nc-row:hover:active{transform:none}}
`;

export function NameCard() {
  return (
    <div className="nc-screen bg-background text-foreground">
      <style>{STYLES}</style>

      <main className="nc-in mx-auto flex w-full max-w-[460px] flex-col pl-5 pr-7 pt-8 pb-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-[128px] w-[96px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 border-2 bg-signal"
              style={{ transform: "translate(8px, 8px)", borderRadius: 2, borderColor: "var(--nc-ybd)", boxShadow: "var(--nc-pt-shadow)" }}
            />
            <img
              src={CARD_PORTRAIT_SRC}
              alt="Portrait of Vijay Krishna"
              width={480}
              height={640}
              loading="eager"
              decoding="async"
              className="relative h-full w-full border-2 bg-muted object-cover object-top"
              style={{ borderRadius: 2, borderColor: "var(--nc-ybd)" }}
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
            style={{ boxShadow: "4px 4px 0 var(--nc-shadow)", color: "var(--accent-foreground)", borderColor: "var(--nc-ybd)" }}
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
                  <a href={href} className="nc-block nc-row">{inner}</a>
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
