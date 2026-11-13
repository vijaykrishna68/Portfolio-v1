/**
 * TEMPORARY review page for the Earned Light foundation (Phase 1A).
 * Route: /design-check. Not linked, not in the sitemap, marked noindex.
 * Remove this file and its route in router.tsx before merging to main.
 */
import { useEffect, useRef, useState } from "react";

import { Button, ButtonLink } from "../components/shared/Button";
import { Container } from "../components/shared/Container";
import { Figure } from "../components/shared/Figure";
import { GlassNav } from "../components/shared/GlassNav";
import { Headline } from "../components/shared/Headline";
import { Label } from "../components/shared/Label";
import { Slab } from "../components/shared/Slab";
import { ToolCell } from "../components/shared/ToolCell";
import { GlyphSprite, ToolWall, ToolWallProvider, useAutoLight, useToolWall } from "../components/shared/ToolWall";
import { GLYPHS } from "../lib/glyphs";

/* ---------- colour maths ---------- */

type RGBA = [number, number, number, number];

function parseColor(raw: string): RGBA | null {
  const v = raw.trim();
  if (v.startsWith("#")) {
    let h = v.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length === 6) h += "ff";
    if (h.length !== 8) return null;
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), n(6) / 255];
  }
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(",").map((x) => parseFloat(x));
  return [p[0], p[1], p[2], p[3] ?? 1];
}

function over(fg: RGBA, bg: RGBA): RGBA {
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
}

function luminance([r, g, b]: RGBA): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function ratio(a: RGBA, b: RGBA): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ---------- token tables ---------- */

const TOKENS: { name: string; usage: string }[] = [
  { name: "ground", usage: "Page background. At least 90% of any view." },
  { name: "panel", usage: "Raised panel or card face on ground." },
  { name: "stone", usage: "Sandstone second slab. Only ink or ink-muted text on it." },
  { name: "ink", usage: "Primary text and linework." },
  { name: "ink-muted", usage: "Secondary text, labels, captions." },
  { name: "line", usage: "Slab borders (1.5px) and meaningful outlines. 3:1 on ground and panel." },
  { name: "hairline", usage: "Decorative dividers and pegboard dots only. Below 3:1." },
  { name: "slab", usage: "The one dark block per composition." },
  { name: "on-slab", usage: "Text on slab." },
  { name: "accent", usage: "Verdigris. Links, active states. Text on ground and panel only." },
  { name: "on-accent", usage: "Text on a filled accent block." },
  { name: "tension", usage: "Rust. Warnings, the one point of tension. Text on ground and panel only." },
  { name: "on-tension", usage: "Text on a filled tension block." },
  { name: "lit", usage: "Dawn gold. One lit part per view, at most 2% of the area. Never text on ground in light." },
  { name: "on-lit", usage: "Text on a filled lit area." },
  { name: "mist", usage: "Soft green band behind ink text." },
  { name: "wash", usage: "Soft rust band behind ink text." },
  { name: "aluminium", usage: "Tool-wall panel edges where contrast is not required." },
];

/** need: minimum ratio the brand sheet requires; null = informational (decoration or never-text). */
type Pair = { fg: string; bg: string; need: 4.5 | 3 | null; note: string };

const PAIRS: Pair[] = [
  { fg: "ink", bg: "ground", need: 4.5, note: "text" },
  { fg: "ink", bg: "panel", need: 4.5, note: "text" },
  { fg: "ink", bg: "stone", need: 4.5, note: "text" },
  { fg: "ink-muted", bg: "ground", need: 4.5, note: "text" },
  { fg: "ink-muted", bg: "panel", need: 4.5, note: "text" },
  { fg: "ink-muted", bg: "stone", need: 4.5, note: "text" },
  { fg: "accent", bg: "ground", need: 4.5, note: "text" },
  { fg: "accent", bg: "panel", need: 4.5, note: "text" },
  { fg: "tension", bg: "ground", need: 4.5, note: "text" },
  { fg: "tension", bg: "panel", need: 4.5, note: "text" },
  { fg: "on-slab", bg: "slab", need: 4.5, note: "text" },
  { fg: "on-accent", bg: "accent", need: 4.5, note: "text" },
  { fg: "on-tension", bg: "tension", need: 4.5, note: "text" },
  { fg: "on-lit", bg: "lit", need: 4.5, note: "text" },
  { fg: "ink", bg: "mist", need: 4.5, note: "text" },
  { fg: "ink", bg: "wash", need: 4.5, note: "text" },
  { fg: "line", bg: "ground", need: 3, note: "border" },
  { fg: "line", bg: "panel", need: 3, note: "border" },
  { fg: "hairline", bg: "ground", need: null, note: "decoration only" },
  { fg: "aluminium", bg: "ground", need: null, note: "decoration only" },
  { fg: "lit", bg: "ground", need: null, note: "never text on ground" },
];

/* ---------- small pieces ---------- */

function Badge({ r, need }: { r: number; need: Pair["need"] }) {
  const text = r.toFixed(2) + ":1";
  if (need === null) return <span className="type-label text-ink-muted">{text} info</span>;
  const ok = r >= need;
  return (
    <span className={`type-label px-1.5 py-0.5 rounded-slab border-stroke ${ok ? "bg-mist border-line text-ink" : "bg-wash border-tension text-ink"}`}>
      {ok ? "PASS" : "FAIL"} {text} (min {need})
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <Label as="p" className="block mb-4">
        {title}
      </Label>
      {children}
    </section>
  );
}

function ContrastTable({ values }: { values: Record<string, string> }) {
  const glass = parseColor(values["glass-fill"] ?? "");
  const ink = parseColor(values["glass-ink"] ?? "");

  const rows = PAIRS.map((p) => {
    const a = parseColor(values[p.fg] ?? "");
    const b = parseColor(values[p.bg] ?? "");
    return { p, r: a && b ? ratio(a, b) : NaN };
  });
  // Text on glass is always bone; glass is translucent, so check it over every surface the nav can scroll across.
  const extra = ["ground", "panel", "stone", "slab", "accent", "tension", "lit"].map((bg) => {
    const base = parseColor(values[bg] ?? "");
    return {
      label: `glass-ink on glass over ${bg} (nav, tool labels)`,
      need: 4.5 as const,
      r: ink && glass && base ? ratio(ink, over(glass, base)) : NaN,
    };
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-caption">
        <thead>
          <tr className="border-b border-line">
            <th className="py-2 pr-4 type-label">Foreground</th>
            <th className="py-2 pr-4 type-label">Background</th>
            <th className="py-2 pr-4 type-label">Use</th>
            <th className="py-2 type-label">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ p, r }) => (
            <tr key={p.fg + p.bg} className="border-b border-hairline">
              <td className="py-1.5 pr-4">
                <span className="inline-block w-3 h-3 align-middle mr-2 border border-line" style={{ background: values[p.fg] }} />
                {p.fg}
              </td>
              <td className="py-1.5 pr-4">
                <span className="inline-block w-3 h-3 align-middle mr-2 border border-line" style={{ background: values[p.bg] }} />
                {p.bg}
              </td>
              <td className="py-1.5 pr-4 text-ink-muted">{p.note}</td>
              <td className="py-1.5">{Number.isNaN(r) ? "…" : <Badge r={r} need={p.need} />}</td>
            </tr>
          ))}
          {extra.map((e) => (
            <tr key={e.label} className="border-b border-hairline">
              <td className="py-1.5 pr-4" colSpan={3}>
                {e.label}
              </td>
              <td className="py-1.5">{Number.isNaN(e.r) ? "…" : <Badge r={e.r} need={e.need} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Swatches({ values }: { values: Record<string, string> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {TOKENS.map((t) => (
        <div key={t.name} className="border-stroke border-line rounded-slab bg-panel">
          <div className="h-14 border-b border-line" style={{ background: `var(--${t.name})` }} />
          <div className="p-3">
            <div className="type-label text-ink">
              {t.name} {values[t.name] ? `· ${values[t.name]}` : ""}
            </div>
            <p className="mt-1 text-caption text-ink-muted">{t.usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const SPACING = ["space-1", "space-2", "space-3", "space-4", "space-6", "space-8", "space-10", "space-18"] as const;

/* ---------- auto-light check ---------- */

function AutoLightDemo() {
  const s = useAutoLight("A1-gear-train");
  const wall = useToolWall();
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 border-stroke border-line rounded-slab bg-panel p-3 type-label text-ink space-y-1" role="status">
        <div>wall in view: {pct(s.wall)} (needs 60%)</div>
        <div>hero in view: {pct(s.hero)} (needs under 20%)</div>
        <div>lit cell: {wall?.litId ?? "none"}</div>
        <div>auto-light fired: {s.done ? "yes" : "no"}</div>
      </div>
      {/* Stand-in for the Hero composition: same data attribute the real one carries */}
      <div data-hero-composition className="relative h-[360px] overflow-hidden border-stroke border-line rounded-slab bg-panel mb-6">
        <div className="absolute left-12 top-8 h-48 w-56 rounded-slab bg-accent" />
        <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-lit" />
        <Label className="absolute left-4 bottom-4">stand-in for the Hero composition (has the lit sun)</Label>
      </div>
      <div ref={s.wallRef}>
        <ToolWall columns={4}>
          {GLYPHS.slice(0, 8).map((g) => (
            <ToolCell key={g.id} glyph={g.id} />
          ))}
        </ToolWall>
      </div>
    </>
  );
}

function AutoLightCheck() {
  const [run, setRun] = useState(0);
  return (
    <Container>
      <Section title="Auto-light check: nothing lit at load; A1 lights once when the wall is 60% in view and the hero is under 20%">
        <p className="text-ink-muted text-caption max-w-[62ch] mb-4">
          Scroll down until the wall fills the view and the stand-in is out of sight: A1 lights once. Scroll back up and nothing changes. Hover or tab to another
          cell and the light stays on your choice.
        </p>
        <Button variant="outline" onClick={() => setRun((r) => r + 1)} className="mb-6">
          Reset check
        </Button>
        <ToolWallProvider key={run} sprite={false}>
          <AutoLightDemo />
        </ToolWallProvider>
      </Section>
    </Container>
  );
}

/* ---------- one full showcase, rendered once per scheme ---------- */

function Showcase({ scheme }: { scheme: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(ref.current);
    const names = [...TOKENS.map((t) => t.name), "glass-fill", "glass-ink"];
    const next: Record<string, string> = {};
    for (const n of names) next[n] = cs.getPropertyValue(`--${n}`).trim();
    setValues(next);
  }, [scheme]);

  const forcedHover = "!-translate-y-1";
  const forcedFocus = "outline outline-[3px] outline-offset-[3px] outline-accent";

  return (
    <div ref={ref} className={`${scheme} bg-background text-foreground py-16 border-t-2 border-line`}>
      <Container>
        <h2 className="font-display text-headline-s">{scheme} theme</h2>

        <Section title="Colour tokens and swatches">
          <Swatches values={values} />
        </Section>

        <Section title="Contrast (computed from the live CSS variables)">
          <ContrastTable values={values} />
        </Section>

        <Section title="Spacing, radius, stroke">
          <div className="flex flex-wrap items-end gap-6">
            {SPACING.map((s) => (
              <div key={s} className="text-center">
                <div className="bg-accent" style={{ width: `var(--${s})`, height: `var(--${s})` }} />
                <Label className="block mt-2">{s}</Label>
              </div>
            ))}
            <div className="text-center">
              <div className="w-16 h-16 border-stroke border-line rounded-slab bg-panel" />
              <Label className="block mt-2">2px radius, 1.5px line</Label>
            </div>
          </div>
        </Section>

        <Section title="Type">
          <div className="space-y-6">
            <div className="font-display text-specimen leading-[0.9] h-[120px] overflow-hidden" aria-hidden="true">
              VK
            </div>
            <p className="font-display text-headline leading-[0.9]">Earned light</p>
            <p className="font-display text-headline-s">Selected work</p>
            <p className="font-text font-semibold text-subhead">Built in the open, shipped quietly.</p>
            <p className="text-body max-w-[62ch]">
              I research until I understand it fully, then build it once. Body text is Hanken Grotesk at 17px with a 1.6 line height and a measure of about
              62 characters.
            </p>
            <Label as="p">A1 · Gear train (label, Martian Mono 500, 11px, 0.1em)</Label>
            <p className="font-figure font-black text-[64px] leading-none">840 ms</p>
          </div>
        </Section>

        <Section title="Headline (width 62 to 84 on hover, single line, hover devices only)">
          <div className="space-y-6">
            <div>
              <Headline as="h3" className="text-[56px] leading-[0.95]">
                Hover this headline
              </Headline>
              <p className="mt-2 text-ink-muted text-caption">Single line: the width relaxes over 560ms. No change on touch or under reduced motion.</p>
            </div>
            <div className="w-[300px] max-w-full">
              <Headline as="h3" className="text-[40px] leading-[0.95]">
                A multi-line headline never changes width
              </Headline>
            </div>
          </div>
        </Section>

        <Section title="Buttons: solid, outline, nav, lit; default / hover / focus / disabled">
          <div className="space-y-6">
            {(["solid", "outline", "nav", "lit"] as const).map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-6">
                <Label className="w-16">{v}</Label>
                <Button variant={v}>Default</Button>
                <Button variant={v} className={forcedHover}>
                  Hover
                </Button>
                <Button variant={v} className={forcedFocus}>
                  Focus
                </Button>
                <Button variant={v} disabled className="opacity-50 pointer-events-none">
                  Disabled
                </Button>
                <ButtonLink variant={v} href="#design-check">
                  Link
                </ButtonLink>
              </div>
            ))}
            <p className="text-ink-muted text-caption">One lit button per view, at most. The lit variant here is a demo.</p>
          </div>
        </Section>

        <Section title="Slab: panel, stone, slab, accent">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Slab variant="panel" label="Panel" className="min-h-[150px]">
              <p className="font-display text-[32px] leading-[0.9]">Quiet</p>
            </Slab>
            <Slab variant="stone" label="Stone" className="min-h-[150px]">
              <p className="font-display text-[32px] leading-[0.9]">Second</p>
            </Slab>
            <Slab variant="slab" label="Slab" className="min-h-[150px]">
              <p className="font-display text-[32px] leading-[0.9]">Hard edge</p>
            </Slab>
            <Slab variant="accent" label="Accent" className="min-h-[150px]">
              <p className="font-display text-[32px] leading-[0.9]">Purpose</p>
            </Slab>
          </div>
        </Section>

        <Section title="Figure (sample numbers, not site content)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Figure value="840" unit="ms" label="before" caption="Search, before the index." />
            <Figure value="90" unit="ms" label="after" caption="Search, after the index." />
            <Figure value="92" unit="px" label="max size" caption="Doto digits run 40 to 92px." size={92} />
          </div>
        </Section>

        <Section title="Tool wall: one lit at a time; hover, focus or tap moves the light">
          <ToolWallProvider sprite={false} defaultLit="C3-desk-lamp">
            <ToolWall columns={4}>
              {GLYPHS.map((g) => (
                <ToolCell key={g.id} glyph={g.id} />
              ))}
            </ToolWall>
          </ToolWallProvider>
          <div className="mt-6 flex flex-wrap items-end gap-6">
            <ToolCell glyph="A2-dial" size={48} lit />
            <ToolCell glyph="C4-calipers" size={24} />
            <p className="text-ink-muted text-caption max-w-[40ch]">
              Controlled cells outside a provider at 48px and 24px: stroke width scales (5 and 9) so the linework stays legible.
            </p>
          </div>
        </Section>

        <Section title="Glass: clear nav glass (ground 40% rising to 77% as needed, 18px blur; fill and text adapt live in the real nav), then the solid fallback">
          <div className="space-y-6">
            <div className="relative h-[120px] overflow-hidden rounded-slab" style={{ background: "linear-gradient(115deg, var(--stone) 0 45%, var(--accent) 45% 70%, var(--tension) 70% 85%, var(--lit) 85%)" }}>
              <GlassNav className="!absolute !inset-x-4 !top-4 rounded-slab border border-[var(--glass-edge)] !border-b text-foreground" aria-label="Glass nav demo">
                <div className="flex items-center gap-6 px-4 py-3">
                  <span className="font-display text-xl mr-auto">Vijay Krishna</span>
                  <span className="type-label">Work</span>
                  <span className="type-label">Tool wall</span>
                  <span className="type-label">About</span>
                </div>
              </GlassNav>
            </div>
            <div className="relative h-[120px] overflow-hidden rounded-slab" style={{ background: "linear-gradient(115deg, var(--stone) 0 45%, var(--accent) 45% 70%, var(--tension) 70% 85%, var(--lit) 85%)" }}>
              <div className="absolute inset-x-4 top-4 rounded-slab border border-[var(--glass-edge)] bg-background text-foreground">
                <div className="flex items-center gap-6 px-4 py-3">
                  <span className="font-display text-xl mr-auto">Solid fallback</span>
                  <span className="type-label">no backdrop-filter / reduced transparency</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Focus ring (tab to these)">
          <div className="flex flex-wrap gap-6">
            <a href="#design-check" className="text-accent underline">
              A link
            </a>
            <button type="button" className="border-stroke border-line rounded-slab px-4 py-2 type-label">
              A bare button
            </button>
            <input aria-label="Sample input" placeholder="An input" className="border-stroke border-line rounded-slab px-3 py-2 bg-panel" />
          </div>
        </Section>
      </Container>
    </div>
  );
}

export default function DesignCheck() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Design check (temporary)";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, []);

  return (
    <main id="design-check" className="pt-24">
      <GlyphSprite />
      <Container>
        <Label as="p">Temporary review page, Phase 1A. Remove before merge.</Label>
        <h1 className="mt-3 font-display text-headline-s">Design check</h1>
        <p className="mt-3 text-ink-muted max-w-[62ch]">
          Every shared component and token in light and dark. The two panels below force their own scheme, whatever the site toggle says.
        </p>
      </Container>
      <AutoLightCheck />
      <Showcase scheme="light" />
      <Showcase scheme="dark" />
    </main>
  );
}
