# Portfolio — Claude Code Guide

Persistent context for this codebase. Verified against the code. Where this file and CONTENT_GUIDE.md / CONTENT_MIGRATION.md disagree, trust this file (those two describe plans and older states).

## 1. Overview

Personal developer portfolio and engineering journal for Vijay Krishna (backend engineer, Bengaluru). A client-rendered single-page app: no SSR, no server, no API. Projects, journal posts and playground experiments are MDX files compiled into the bundle at build time. The visual identity is **Earned Light** (see §5); work here is content authoring, content infrastructure, and keeping the design rules intact.

## 2. Stack and commands

- **Vite 6.3.5**, **React 18.3.1**, **react-router 7.13** (`createBrowserRouter`, every page lazy-loaded), **Tailwind CSS 4.1.12** (CSS-first, no `tailwind.config.js`), **MDX** via `@mdx-js/rollup` with `remark-frontmatter`, `remark-mdx-frontmatter`, `remark-gfm` and the repo's `remarkContentImages` plugin.
- **TypeScript with `strict`** (`tsconfig.json`). `npm run build` does not type-check; run **`npm run typecheck`** too. Always run both, then load the affected route in a browser.
- npm is the package manager (`package-lock.json`). Package name `vijay-portfolio`. `dist/` is ignored. No test runner or linter.
- Direct runtime deps are few: `react`, `react-dom`, `react-router`, `motion`, `lucide-react`, `tw-animate-css` and the MDX/remark packages. Do not add dependencies without a reason.
- Dev: `npm run dev` (port 5173). Deploy: Vercel, static, SPA rewrite in `vercel.json`. No env vars.

## 3. Layout

```
index.html                         theme bootstrap script, font <link>s, meta/OG tags
src/main.tsx, src/app/App.tsx      mounts <RouterProvider>
src/app/router.tsx                 routes (all lazy)
src/app/components/layout/Layout.tsx   shell: skip link, Navbar, <Outlet/>, Footer, theme state
src/app/components/shared/         design-system components (§6)
src/app/components/{Hero,ToolWall,SelectedWork,Timeline,Journal,Playground,About,Footer,Navbar}/   page sections
src/app/pages/**                   one component per route
src/app/hooks/                     useAdaptiveNav, useNoHover, usePrefersReducedMotion, usePageTitle
src/app/lib/content/               content API (loaders, types, utils); import only from lib/content/index.ts
src/app/lib/mdx/                   MDX_COMPONENTS style map, remarkContentImages
src/app/lib/{interaction,glyphs,constants}.ts
src/app/content/site.ts            site config: socials, email, "currently" items, about stats, portrait path
src/app/content/tools.ts           tool-wall data: technologies per glyph, "curious about" glyphs
src/app/content/projects.ts        only the Timeline array (biographical), despite the name
src/styles/                        index.css, tailwind.css (sources), theme.css (all tokens)
src/assets/glyphs/, src/assets/monogram/   brand artwork (sprite, 12 glyphs x light/dark, VK marks)
content/{projects,journal,playground}/<slug>/index.mdx   the publishable content
public/                            favicon.svg, apple-touch-icon.png, og-image.png, portrait.jpg, robots.txt, sitemap.xml
```

Two type files exist: `src/app/types/portfolio.ts` (display models for Timeline/Navbar/site) and `src/app/lib/content/types.ts` (the content model). `portfolio.ts` still contains dead legacy `Project`/`JournalArticle`/`PlaygroundItem` shapes.

## 4. Routes

`/` (Hero, Toolkit, Selected Work, Timeline, Journal, Playground, About; Footer is the Contact section), `/projects`, `/projects/:slug`, `/journal`, `/journal/:slug`, `/playground`, `/playground/:slug`, and `*` (NotFound; detail pages redirect misses to `/404`, which the wildcard catches). New content needs no route; new routes need `router.tsx`.

## 5. Design system: Earned Light

Source of truth is the Earned Light brand sheet (tokens.json, README, component READMEs). The picture: a tool wall at dawn. Matte mineral ground, hard-edged slabs, exact linework, and one part lit in gold because it is in use.

**Where tokens live:** `src/styles/theme.css`.
- Light values on `:root, .light`; dark values on `.dark` (class on `<html>`; `.dark`/`.light` also work on any wrapper). The semantic aliases (`--background`, `--foreground`, `--card`, `--border`, `--accent`, `--destructive`, `--muted-foreground`...) are declared in a `:root, .light, .dark` block so nested scopes recompute them.
- Brand tokens: `ground, panel, stone, ink, ink-muted, line, hairline, slab, on-slab, accent (verdigris), on-accent, tension (rust), on-tension, lit (gold), on-lit, mist, wash, aluminium`, plus `--space-1…18`, `--radius-slab: 2px`, `--stroke-slab: 1.5px`, glass tokens. Mapping: ground→background, panel→card, ink→foreground, ink-muted→muted-foreground, line→border, accent→accent/primary, tension→destructive, `--signal`→accent.
- `@theme inline` exposes them as Tailwind utilities: `bg-slab`, `text-on-slab`, `bg-lit`, `text-ink-muted`, `border-line`, `border-hairline`, `rounded-slab` (all `rounded-*` resolve to 2px), type sizes `text-label|caption|body|subhead|headline-s|headline|specimen`, and `border-stroke` / `type-label` utilities. Default shadow utilities are removed.
- Tailwind scans `src/` and `content/**/*.mdx` (`tailwind.css`), because Playground tile placement classes live in MDX frontmatter.

**Fonts** (four separate Google `<link>`s in `index.html`; fallback stacks in theme.css):
- `font-display` Anybody (variable `wdth`/`wght`): headlines and the VK mark. Uppercase, weight 800–900, never under 20px, never a sentence. `.font-display` sets uppercase, 800, `wdth` 75 at rest.
- `font-text` Hanken Grotesk (400, 600): body 17px / 1.6, measure about 62ch (`max-w-[62ch]`), subheads 600 sentence case. Upright only: no italics.
- `font-mono` Martian Mono 500: labels (`type-label`: 11px, uppercase, 0.1em), tags, buttons (12px).
- `font-figure` Doto 900: metric digits and units only, 40–92px.

**Rules to keep on every route:**
- Neutral ground at least 90%: colour appears as two or three purposeful slabs, never a wash. Verdigris (`accent`) and rust (`tension`) are fills. Accent may be text only on `ground`/`panel` (links, small labels); rust is never text; gold is never text.
- One lit (`lit`, #FFB400) part per view, at most 2% of the area: the Hero sun, or the lit tool cell, or a lit button. Never decorative.
- Radius 2px everywhere (circles only for the sun and the avatar). Borders on slabs are `border-stroke` (1.5px) in `line`; 1px is only for decorative dividers in `hairline`.
- No soft shadows, no pills, no gradients except the Playground photo scrim (`.playground-scrim`, slate 75%). The dot grids are SVG patterns, not CSS gradients.
- Text stays horizontal. No hover effects on touch (Tailwind's `hover:` is already wrapped in `(hover: hover)`); every motion must respect `prefers-reduced-motion` (`motion-reduce:` variants or `usePrefersReducedMotion`).
- Every interactive element has the global 3px accent focus ring with 3px offset (`theme.css` base layer; do not put `transition-all` on focusable elements, it animates the offset).
- Do not invent colours, sizes or radii that are not in the tokens. No purple/blue gradients, no emoji in copy.

**Voice:** first person, plain, specific, backed by a real number. Short sentences. No clichés or hype words. Never invent a figure.

## 6. Components (`src/app/components/shared/`)

- `Slab` (variants `panel | stone | mist | slab | accent`, optional `label`): hard-edged block; every card is a Slab.
- `Label`: mono label. `Figure`: Doto metric with label and caption (`variant` for the surface).
- `Button`, `ButtonLink`, `buttonClassName()`: variants `solid | outline | nav | lit` (one `lit` per view, and then nothing else gold). Hover lifts 4px (280ms), reduced-motion safe.
- `Headline`: display headline whose width axis relaxes on hover (default `wdth` 75→96; `HEADLINE_HOVER_NAME` 62→84 for the name and short lines), only while it stays on one line, only with a hover pointer, never under reduced motion. Used by the Toolkit, Timeline and Playground headings and the 404.
- `ToolWallProvider`, `ToolWall`, `ToolCell`, `useAutoLight`, `GlyphSprite`: the tool wall (§7).
- `GlassNav`: the fixed nav container (§8). `Reveal`, `Container`, `SectionLabel`, `Tag`: unchanged primitives (`Reveal` is the entrance animation; it skips animating under reduced motion).
- `src/app/lib/interaction.ts` (`INTERACTION`): shared transition classes; the lift classes are reduced-motion safe.

## 7. Hero and tool wall

- Hero (`Hero/Hero.tsx`): the name in `ink`, no accent or rust text anywhere in it. Right column is `HeroComposition`: a 1.5px `line` frame holding a dot grid, one filled accent slab with the VK mark, one small rust block (no text), and the single lit sun, clipped by the frame's corner. It renders twice (mobile and desktop slots), so SVG ids are unique per instance (`useId`).
- Tool wall (`ToolWall/ToolWallSection.tsx`, data in `content/tools.ts`): 8 glyphs for real tools, each with a caption listing its technologies, then 4 more under "Curious about" with no captions. Exactly one cell is lit at a time; hover, focus or tap moves the light. Nothing is lit at load. `useAutoLight` lights A1 once when the wall is at least 60% in view and the Hero composition is under 20% in view; it fades the light out (240ms) while the Hero composition is over 50% in view or its sun (`[data-hero-sun]`) is visible, and relights the last-chosen cell when the Hero is under 20% again. Keeps one gold part on screen.
- Glyph sprite is inlined once per page by `ToolWallProvider`; unlit gold parts are `hairline`, lit is `lit`.

## 8. Glass

Glass appears on the sticky nav and the tool-wall labels only, never over cards.
- Nav (`GlassNav` + `hooks/useAdaptiveNav.ts`): clear glass, the theme's `ground` at 40%, 18px blur, 120% saturate, 1px edge and inner highlight. The fill is adaptive: it rises through 55%, 66% and 77% only as far as needed for every nav item to reach 4.5:1 (weaker of full and 78%-strength text) over whatever is beneath it. Each item samples what sits under its centre (`document.elementsFromPoint`, same-origin image pixels, SVG fills, computed backgrounds, optional `data-surface="dark|light"`), picks dark ink or bone, and transitions colour over 200ms. Mark nav items with `data-nav-item`. Falls back to solid `ground` with theme text when `backdrop-filter` is unsupported or `prefers-reduced-transparency` is set; no transitions under reduced motion.
- Labels (`.glass-label`): slate-tinted glass with bone text, solid fallback.

## 9. Content system

Pipeline: `content/<type>/<slug>/index.mdx` → `@mdx-js/rollup` (frontmatter lifted to a `frontmatter` export) → loaders in `src/app/lib/content/{projects,journal,playground}.ts` use `import.meta.glob(..., { eager: true })` → components import only from `lib/content/index.ts` (`getProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getJournalPosts`, `getJournalPost`, `getFeaturedJournalPost`, `getPlaygroundItems`, `getPlaygroundItem`, `formatDate`). Detail pages render `<Body components={MDX_COMPONENTS} />` inside a 62ch wrapper; the map is not global, so any new page rendering MDX must pass it.

Rules:
- **The directory name is the slug.** A `slug:` frontmatter key is stripped.
- `status` is matched tolerantly (`isPublished`); drafts never render. Projects sort by `displayIndex` (zero-padded string); journal newest-first; playground in glob order (the home grid re-sorts largest tile first).
- `getFeaturedProjects()` feeds the home page (Selected Work); `/projects` shows every published project. `getFeaturedJournalPost()` falls back to the newest post.
- Images: `cover: "./cover.webp"` is resolved by the loader (`assets.ts` globs all of `content/`); body `![](./x.png)` is rewritten to a real import by `remarkContentImages`; a missing file is a hard build failure. `https://` URLs are used as-is. Drafts' images still ship in the bundle.
- MDX gotchas: `<` followed by a digit is parsed as JSX (write "under 50"); fenced code gets no syntax highlighting; GFM tables render through the `table/th/td` map entries.
- No runtime frontmatter validator and no TypeScript check of frontmatter: check the schema in `lib/content/types.ts` by hand against every `.mdx` file before changing it.

Frontmatter (all types): `type, title, description, status, publishedAt, tags[], cover`. Project adds `year, challenge, technologies[], impact, displayIndex, displayLayout (default|flip), featured`, optional `featuredIndex, hook, role, links{github,live,writeup,caseStudy}, coverAlt`, and the optional **`figure`** below. Journal adds `excerpt, readTime, featured`. Playground adds `summary, layout{desktop,mobile}` (Tailwind span classes; only `col-span-N`/`row-span-N` are honoured on the home grid, which is 3 columns × 2 rows and auto-places tiles largest-first), optional `demoUrl, sourceUrl`.

### Add a project

1. `mkdir content/projects/<slug>` and copy `content/templates/project-template.mdx` to `index.mdx`; put `cover.webp` (compressed, under about 300 KB) and any body images beside it.
2. Fill the required fields; leave `status: draft` until ready, then `published`. Set `featured: true` to show it in Selected Work.
3. **Figure (optional).** Only if `impact` already states a real number, add one line under `impact:`:
   `figure: { value: "141", unit: "KB", label: "Gzipped JS bundle, approx." }`
   `value` is the digits only (Doto renders digits and units), `unit` is optional, `label` says what it measures. The card shows a Figure (digits, label, and the `impact` sentence as caption) instead of the plain Impact band. Never invent a number; with no `figure` the card shows the Impact band.
4. Add the URL to `public/sitemap.xml` by hand (nothing generates it).
5. Run `npm run build` and `npm run typecheck`, and open `/projects/<slug>`.

Edit = change the `.mdx`. Delete = remove the directory and its sitemap entry. Journal and playground work the same way with their templates.

## 10. Theme and deployment

- Theme: an inline script in `index.html` (before paint) reads `localStorage("theme")` then `prefers-color-scheme` and adds `dark` to `<html>`; `Layout` resolves the same sources, toggles the class and persists the choice. The key `"theme"` appears in both `index.html` and `lib/constants.ts` and must stay in sync. No live listener for OS changes after mount.
- SEO: canonical, Open Graph and Twitter tags in `index.html` and `robots.txt`/`sitemap.xml` all use `https://portfolio-v1-blush-eight.vercel.app`. `og-image.png` is 1200×630 (VK mark, name, palette, one gold sun); rebuild it if the identity changes.
- Static output only; nothing environment-dependent.

## 11. Rules for future changes

- Content files are data, components are presentation: never hardcode a project, post or experiment in a `.tsx` file.
- Reuse the shared components and tokens; do not add hex literals, `text-[Npx]` sizes, shadows, gradients or radii. Check new UI against the §5 rules in light and dark and at 400px.
- Keep copy changes deliberate and in voice; the Hero tagline, section headings and About text are known to contain generic phrasing that the owner has not yet reworded.
- Do not replace the `import.meta.glob` MDX architecture with the `fs`/`gray-matter` plan in CONTENT_MIGRATION.md.
- After any change to loaders, `vite.config.ts`, `assets.ts` or `remarkContentImages.ts`, verify both `npm run dev` and `npm run build`, and use a disposable fixture for new MDX mechanisms.
- Known leftovers: `src/app/types/portfolio.ts` legacy types are dead; `readTime` is hand-written; `ATTRIBUTIONS.md` and `postcss.config.mjs` are kept on purpose.
