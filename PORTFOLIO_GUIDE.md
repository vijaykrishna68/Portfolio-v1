# Portfolio Maintenance Guide

This is a practical, step-by-step guide for maintaining and updating this
portfolio yourself. It documents the **actual current implementation** —
every path, field name, and behavior below was verified against the real
files in this repository, not assumed.

For deeper architectural context (why things are built this way, known
gotchas, dead code, etc.), see [`CLAUDE.md`](CLAUDE.md) at the repo root.
This guide focuses purely on "how do I change X."

---

## 1. Project management

Projects live at `content/projects/<slug>/index.mdx`. The directory name
**is** the URL slug — always. A `slug:` field inside frontmatter is parsed
but explicitly discarded by the loader, so it can never take effect.

### Add a new project

```bash
mkdir content/projects/your-project-slug
cp content/templates/project-template.mdx content/projects/your-project-slug/index.mdx
```

1. Fill in the frontmatter (see field list below).
2. Add `cover.png` (and any Gallery images) into that same directory.
3. Leave `status: draft` until it's ready, then flip to `status: published`.
4. Add the new URL to `public/sitemap.xml` by hand — nothing generates
   this file automatically.

No route needs to be registered. `import.meta.glob` in
`src/app/lib/content/projects.ts` picks up any new `index.mdx` under
`content/projects/*/` automatically, and `/projects/your-project-slug`
just works.

### Remove a project

Delete the entire `content/projects/<slug>/` directory, then remove its
`<url>` entry from `public/sitemap.xml` by hand. Nothing else in the
codebase references a project by path.

### Replace an existing project

This repository has already done this once for real (swapping
"Manufacturing Intelligence Platform" for the "S1P Charity" project), and
the steps were exactly: delete the old project's directory, create the new
one, and update `public/sitemap.xml` — no other file needed to change.

### Ordering — `displayIndex` vs `featuredIndex`

- **`displayIndex`** (required, string, e.g. `"01"`) controls order on
  `/projects`. Projects sort by `displayIndex.localeCompare(...)` — this is
  **string** comparison, not numeric. Always zero-pad
  (`"01"`, `"02"`, … `"10"`), or `"10"` will sort before `"2"`.
- **`featuredIndex`** (optional, string) controls order **within the
  homepage "Selected Work" section only**, independent of `displayIndex`.
  If omitted, it falls back to `displayIndex`. This separation exists
  specifically so picking which project is homepage-dominant never
  reorders `/projects`.
- Only projects with `featured: true` appear on the homepage at all.
  `/projects` always shows every published project regardless of
  `featured`.

### Make a project the dominant homepage project

The project whose `featuredIndex` is the **lowest** among all
`featured: true` projects becomes the large "dominant" card at the top of
Selected Work; every other featured project renders as a small "compact"
card. Currently `"01"` (Vector — Production Scheduling Platform) is
dominant.

**Important side effect:** whichever project has `featuredIndex: "01"`
also gets a different cover image treatment in two places —
`src/app/components/SelectedWork/ProjectCard.tsx` and
`src/app/pages/projects/ProjectDetail.tsx` both special-case
`featuredIndex === "01"` to use a wider `aspect-[16/9]` box instead of the
default `aspect-[16/10]` (see §2 for why this matters). Making a different
project dominant will change how *its* cover crops, not just its position.

### Editing title/description/hook/challenge/impact/tags/links

All plain frontmatter edits — open the project's `index.mdx` and edit
directly, no code involved:

```yaml
title: "Vector — Production Scheduling Platform"
description: "A capacity-aware production scheduling platform that turns Excel-based manufacturing demand into validated, deterministic production plans."
tags: ["React","Vite","Tailwind CSS","Node.js","Express","MongoDB","Mongoose","xlsx","Render"]
challenge: "Replace a manual Excel-based production planning workflow..."
impact: "Cut manual production allocation from 3 days to 30 minutes..."
hook: "Turning a planner's Excel workbook into a deterministic, capacity-aware production schedule — without taking Excel away from them."
links:
  github: "https://github.com/vijaykrishna68/Vector_UPDATE"
  live: "https://vector-update-403i.onrender.com/"
  writeup: ""
  caseStudy: ""
```

Notes:
- Only `tags[0]` is ever displayed anywhere (cards and detail headers show
  one tag, not the full list).
- `hook` is optional — only shown on the detail-page hero if present.
- `links.github` / `links.live` / `links.writeup` / `links.caseStudy` each
  render as a button on the detail page only if non-empty; leave unused
  ones as `""` or omit them.

---

## 2. Project images

### Where covers live

Beside the project's `index.mdx`, referenced with a relative path:

```
content/projects/production-line-scheduling-system/
  index.mdx
  cover.png
  dashboard-overview.png
  allocation-table.png
```

```yaml
cover: "./cover.png"
coverAlt: "Vector production-line capacity and weekly allocation overview"
```

### Replacing a cover

Just overwrite the file at the same path (or add a new file and update the
`cover:` path to match). Nothing else references the filename. Vite
re-hashes it automatically on the next build.

### Adding Gallery images

Add image files beside `index.mdx`, then reference them in the MDX body
with standard Markdown image syntax, conventionally under a `## Gallery`
heading (this heading is a convention, not a hard requirement):

```md
## Gallery

![Vector dashboard showing allocated demand, capacity utilisation, and per-line status](./dashboard-overview.png)

![Part-level allocation table for a single planning week, with per-day quantities and status](./allocation-table.png)
```

This is exactly how Vector's real Gallery is written today
(`content/projects/production-line-scheduling-system/index.mdx`).

### How Gallery images get resolved (different mechanism than covers)

Frontmatter `cover` goes through `resolveAsset()` in
`src/app/lib/content/assets.ts`. MDX-body images go through a **separate**
custom remark plugin, `remarkContentImages`
(`src/app/lib/mdx/remarkContentImages.ts`, registered in
`vite.config.ts`), which rewrites `![alt](./file.png)` into a real
`import` statement before compilation. Both mechanisms ignore absolute
URLs (`https://...`) and leave them untouched.

**Sharp edge:** because Gallery images are now real `import`s, a body
image pointing at a file that doesn't exist is a **hard build failure**
(`Could not resolve "./typo.png"`), not a silently broken `<img>`. Double
check the filename/extension/case before committing.

### Supported formats

`.png .jpg .jpeg .gif .webp .svg .avif` — this is the exact glob pattern
`assets.ts` uses to bundle frontmatter cover images. Stick to `png`/`jpg`/
`webp` to match existing content.

### Cover dimensions/ratio — based on the actual current implementation

Real examples currently in the repo:

| Project | Cover size | Ratio |
|---|---|---|
| Vector (`production-line-scheduling-system`) | 1672×941 | ≈16:9 |
| S1P Charity (`sacrifice-one-pizza`) | 1870×841 | ≈2.22:1 (wider than 16:9) |

**A cover's displayed ratio depends on WHERE it renders, and whether the
project is the homepage-dominant one (`featuredIndex: "01"`):**

| Location | Component | featuredIndex "01" | Every other project |
|---|---|---|---|
| Homepage, dominant slot | `ProjectCard.tsx` → `DominantCard` | `aspect-[16/9]` | *(only "01" can be dominant)* |
| Homepage, compact slot | `ProjectCard.tsx` → `CompactCard` | *(n/a — "01" is always dominant)* | `aspect-[4/3]` |
| `/projects` catalog | `ProjectCard.tsx` → `DefaultCard` | `aspect-[16/9]` | `aspect-[16/10]` |
| Project detail page hero | `ProjectDetail.tsx` | `aspect-[16/9]` | `aspect-[16/9]` |

All of these use `object-cover`, so the image is scaled to completely fill
its box and whatever doesn't fit is cropped off-screen — never letterboxed.

**Recommendation:** a source image close to **16:9** crops least overall,
since that's the most common box in the table above. If a project is (or
might become) `featuredIndex: "01"`, 16:9 is effectively required for
minimal cropping since that project appears in 16:9 boxes everywhere.

### How cover ratio differs from Gallery ratio

Gallery images (rendered inside the MDX body) use a completely different
rule: `MDX_COMPONENTS.img` in `src/app/lib/mdx/components.tsx` is just
`className="w-full border border-border my-6"` — **no fixed aspect ratio,
no `object-cover`**. A Gallery image renders at its own natural aspect
ratio, full width, never cropped. This is why Vector's two Gallery images
(1865×517 and 1836×741 — very different ratios) both display correctly
without any special handling.

### What to watch for with `object-cover` / avoiding accidental cropping

Because covers get cropped to a fixed box that changes depending on where
they're shown, a cover with important content near its edges (a header bar
right at the top, text near the left/right edge) can lose that content in
a narrower or squarer box like `4:3` or `16:10`. Both real covers in this
repo (Vector, S1P) are "subject centered on a desk with generous
background space" photos — that composition crops gracefully at *any*
ratio because there's nothing important near the edges. Favor that kind of
composition for new covers.

If a specific cover is unacceptably cropped somewhere, there is currently
**no per-project custom-ratio frontmatter field** — the only levers are:
(1) crop/re-export the source image, (2) change whether the project is
`featuredIndex: "01"`, or (3) as a deliberate, occasional exception, a
small scoped code change to the specific `aspect-[...]` class for that
one project (this has been done once already, for Vector, when its new
cover didn't fit `aspect-[9/4]`). Don't reach for (3) as a routine content
change — it touches shared component code.

---

## 3. Journal

Journal posts live at `content/journal/<slug>/index.mdx`, loaded by
`src/app/lib/content/journal.ts` via
`import.meta.glob("/content/journal/*/index.mdx", { eager: true })` — the
same pattern as projects, entirely separate loader/list.

### Add a new journal entry

```bash
mkdir content/journal/your-post-slug
cp content/templates/journal-template.mdx content/journal/your-post-slug/index.mdx
```

Fill in frontmatter, write the body, set `status: published` when ready.
No route registration needed — same as projects.

### Edit an existing entry

Open `content/journal/<slug>/index.mdx` directly. Every field below and
the entire MDX body are plain-text edits, safe to make without touching
any code:

```yaml
type: journal
title: "Post Title"
description: "..."
excerpt: "..."          # shown on cards + detail-page subheading
status: published
publishedAt: "2026-01-15"
tags: ["Explainer"]
cover: "./cover.png"
coverAlt: "..."
readTime: "8 min"        # free text — nothing computes this
featured: false
```

### Change the date

Edit `publishedAt` (`"YYYY-MM-DD"`). This is the **only** ordering
mechanism for journal posts — `getJournalPosts()` sorts newest-first by
this field. There is no separate `displayIndex` for journal, unlike
projects.

### Title/description/excerpt/tags

All plain frontmatter string/array edits, same as projects. Only
`tags[0]` is ever displayed.

### Featured post behavior

`getFeaturedJournalPost()` picks the newest post with `featured: true`;
if none is marked featured, it falls back to the single newest published
post automatically. It's safe to leave `featured` unset — the homepage
will never crash or show nothing as long as at least one post is
published.

### Images

Works identically to projects (§2): a `cover: "./cover.png"` frontmatter
field resolved via `resolveAsset()`, and in-body Gallery-style images via
`![alt](./file.png)` resolved via the same `remarkContentImages` plugin.
There's no journal-specific image mechanism — it's the exact same content
pipeline shared across all three content types.

### What the content loader does automatically

Any `index.mdx` dropped into `content/journal/<new-slug>/` is picked up
the next time Vite processes the project (dev-server HMR, or the next
`npm run build`) — no manual registration, no imports to add anywhere.

---

## 4. Playground

Playground items live at `content/playground/<slug>/index.mdx`, loaded by
`src/app/lib/content/playground.ts`, same `import.meta.glob` pattern.

### Add a new experiment

```bash
mkdir content/playground/your-experiment-slug
cp content/templates/playground-template.mdx content/playground/your-experiment-slug/index.mdx
```

Frontmatter fields:

```yaml
type: playground
title: "Experiment Title"
description: "..."
summary: "..."           # shown on cards
status: published
publishedAt: "2026-01-15"
tags: ["Explainer"]
cover: "./preview.png"
coverAlt: "..."
layout:
  desktop: "col-start-3 col-span-1 row-start-1 row-span-1"
  mobile: "col-span-1 row-span-1"
demoUrl: ""
sourceUrl: ""
```

**`layout.desktop`/`layout.mobile` are raw Tailwind grid-placement
classes you hand-author yourself.** The homepage Playground grid is a
*fixed* 4-column × 2-row desktop grid (2-column on mobile) — adding a
5th item, or removing one, does **not** automatically rebalance anyone
else's position. This repository already hit this directly: removing
"DNS Resolution Explainer" left an empty cell (row 2, columns 3–4) in the
homepage grid, because the other three items' `layout.desktop` values
were correctly left untouched rather than auto-adjusted. If you add or
remove an item, decide on purpose whether the remaining items' grid
positions need manual rebalancing.

### Remove an experiment

Delete the directory (`content/playground/<slug>/`) and remove its
`<url>` from `public/sitemap.xml`. Expect the homepage grid gap described
above unless you also hand-edit the remaining items' `layout.desktop`/
`layout.mobile` values.

### Edit an experiment

Direct frontmatter/body edits in its `index.mdx`, same as journal — no
code involved.

### Ordering

There is **no ordering field** for Playground, unlike projects'
`displayIndex`. `getPlaygroundItems()` returns items in whatever order
`import.meta.glob` happens to return them (directory read order — not
guaranteed to match creation order). The *visual* position on the
homepage is controlled entirely by each item's `layout.desktop`/
`layout.mobile` grid-placement classes, not list order. On `/playground`,
order genuinely is just glob order (that page uses a plain wrapping grid
with no explicit placement).

### Image

Same `cover:` frontmatter mechanism as projects/journal. Current
Playground items mostly use external `https://images.unsplash.com/...`
URLs directly in `cover:` rather than a local file — both are valid; a
relative `./preview.png` path gets bundled by Vite, an absolute URL is
used as-is.

### Homepage vs `/playground` — these use DIFFERENT markup

This is a real duplication worth knowing about:

- **Homepage** (`src/app/components/Playground/Playground.tsx`) renders
  each item through the shared `PlaygroundCard` component
  (`src/app/components/Playground/PlaygroundCard.tsx`), using each item's
  `layout.desktop`/`layout.mobile` for grid placement. Hover language:
  dashed border + small tilt + scale.
- **`/playground` catalog** (`src/app/pages/playground/PlaygroundIndex.tsx`)
  does **not** import or reuse `PlaygroundCard` at all — it has its own
  separate inline JSX for the card (visually similar overlay treatment,
  but a fixed `aspect-[4/3]` cell in a responsive `sm:2-col`/`lg:3-col`
  grid, and it completely ignores `layout.desktop`/`layout.mobile`).

**Practical consequence:** a visual tweak made only inside
`PlaygroundCard.tsx` (e.g. changing the overlay darkness or hover
transform) will not automatically apply to `/playground` — both files
need to be edited to keep them in sync. Journal has the identical
pattern for the identical reason — see §9.

---

## 5. Hero — changing details

There is **no dedicated Hero content/data file**. `CURRENTLY_ITEMS` (in
`src/app/content/site.ts`) is the *only* Hero-related field that lives in
a content file. Everything else about the Hero is literal JSX text or
logic inside component files under `src/app/components/Hero/`.

### CONTENT changes (edit a data file, no JSX/logic involved)

| What | File | Field |
|---|---|---|
| Currently building / learning / exploring / reading (the rotating status line) | `src/app/content/site.ts` | `CURRENTLY_ITEMS` array — `{ label, value }` pairs |

### CODE changes (edit JSX text or component logic in `.tsx` files)

All of the following are in `src/app/components/Hero/Hero.tsx` unless
noted otherwise. Editing plain text inside these is low-risk; changing
surrounding classes/structure is not.

| What | File | Where |
|---|---|---|
| Name ("Vijay Krishna.") | `Hero.tsx` | Two `<span>` elements inside the `<h1>`. Also carries the mouse-hover color classes (`group-hover:text-[...]`) *and* the mobile static-color classes (`[@media(hover:none)]:text-[...]`) — keep both sets of classes if you edit these spans. |
| Tagline ("I build software that solves real problems.") | `Hero.tsx` | The `<p>` right after the `<h1>` |
| Role line ("Full Stack Engineer · Pragmatic Developer · Open to Freelance Work") | `Hero.tsx` | Three `<span>` elements in the mono-font row below `HeroStatus` |
| Freelance availability wording | `Hero.tsx` | The last `<span>` in that same role-line row — a single short phrase |
| View Work / Read Journal buttons | `Hero.tsx` | Two `<ButtonLink>` elements — hrefs are anchor scrolls (`#work`, `#journal`) to section ids elsewhere on the page, not content-driven |
| Currently-building/learning/etc. rotation timing, pause-on-hover behavior | `src/app/components/Hero/HeroStatus.tsx` | The rotation `useEffect` (4.5s interval, 180ms crossfade) |
| Technology/logo pool | `src/app/components/shared/TechIcons.tsx` | `TECHNOLOGIES` array (currently 17 entries) — see below |
| Visible logo count (currently 8 desktop / 5 tablet) | `src/app/components/Hero/HeroTechCluster.tsx` | `SLOTS` array (desktop count) and `TABLET_SLOT_IDS` (tablet subset) |
| Logo rotation behavior/cadence | `HeroTechCluster.tsx` | `MIN_INTERVAL_MS`, `JITTER_MS`, `CROSSFADE_SECONDS` constants and the rotation `useEffect` |
| Mobile static alternate name color | `Hero.tsx` | The `[@media(hover:none)]:text-[...]` Tailwind classes on the name spans (CSS-only, no JS) |

**Adding a new technology logo** is a code change, not a content edit —
there's no external icon library or logo-image folder here. You add a new
hand-drawn `currentColor` SVG icon function to `TechIcons.tsx` (matching
the existing 17 in style: `viewBox="0 0 24 24"`, `stroke="currentColor"`,
`strokeWidth="1.4"`) and one new entry in the `TECHNOLOGIES` array. It
then automatically becomes eligible to rotate into the Hero cluster —
`HeroTechCluster.tsx` doesn't need to change.

---

## 6. About section

### CONTENT changes (site.ts)

The 3-stat grid at the bottom of About (Languages / Currently reading /
Based in) comes from `aboutStats` in `src/app/content/site.ts`:

```ts
export const aboutStats = [
  { label: "Languages", value: "TypeScript · Next.js · Python" },
  { label: "Currently reading", value: "DDIA, 2nd Ed." },
  { label: "Based in", value: "Chennai / Bangalore, India" },
] satisfies readonly AboutStat[];
```

Editing any `value` here is a plain content edit — no code involved. This
grid always shows exactly the 3 entries in this array; adding/removing an
entry changes the grid's column count (`sm:grid-cols-3` in `About.tsx`
assumes exactly 3, so keep it at 3 unless you also adjust that class).

The portrait image is also configured in `site.ts`:

```ts
export const PORTRAIT_SRC = "/portait.jpg"; // set to "" to hide the portrait
```

Note the filename is genuinely `portait.jpg` (missing the second "r") —
that's the real, deployed filename in `public/`, not a typo to silently
"fix." If you ever rename the file, update this constant in the same
commit.

### CODE changes (About.tsx)

The bio paragraphs and the pull-quote are literal JSX text in
`src/app/components/About/About.tsx`:

- 4 `<p>` tags forming the bio ("I'm Vijay Krishna, a backend engineer
  based in Chennai / Bangalore, India...", etc.)
- The italic pull-quote ("Software should solve problems, not create
  them.")

These are plain prose edits inside a `.tsx` file — safe to change text,
just don't touch the surrounding `className`/structure.

### "Currently building" is NOT part of About

This is a common point of confusion: About's stat grid has "Currently
**reading**" (from `aboutStats` in `site.ts`), which is a *different*
field from Hero's rotating "Currently **building**/learning/exploring/
reading" line (from `CURRENTLY_ITEMS`, also in `site.ts` but consumed by
`HeroStatus.tsx`, not `About.tsx`). They're separate arrays with separate
consumers — editing one never affects the other.

---

## 7. Contact information

**Single source of truth:** `CONTACT_EMAIL` in `src/app/content/site.ts`:

```ts
export const CONTACT_EMAIL = "vijaykrishna.dev.in@gmail.com";
```

Everywhere this email appears is derived from this one constant:

- `SOCIAL_LINKS` (also in `site.ts`) builds a `mailto:${CONTACT_EMAIL}`
  entry with `CONTACT_EMAIL` as its visible label.
- `src/app/components/Footer/Footer.tsx` imports `CONTACT_EMAIL` directly
  for the large "Let's build something worth building." contact CTA
  (`mailto:` link + visible email text), **and** imports `SOCIAL_LINKS`
  for the icon row underneath (which includes the mail icon using the
  same email).

**To change the email everywhere:** edit that one line in `site.ts`. Both
Footer locations update automatically — there is no other file in the
repository with a hardcoded email address (verified by a repo-wide
search).

**One thing this constant does *not* control:** Footer's small print line
— `"Vijay Krishna · {year} · Bengaluru, India"` — is a separate, fully
hardcoded string directly in `Footer.tsx`, unrelated to `CONTACT_EMAIL`
and also unrelated to About's `aboutStats` "Based in" value. It currently
still reads "Bengaluru, India" even though About's location stat was
deliberately changed to "Chennai / Bangalore, India" in an earlier
maintenance pass — that was a scoped decision at the time, not an
oversight, but it means the two locations currently disagree if you look
closely. Edit `Footer.tsx` directly if you want them to match.

---

## 8. Images/assets — general conventions

| Asset | Lives at | Referenced as |
|---|---|---|
| Project cover + Gallery images | `content/projects/<slug>/` (beside `index.mdx`) | Relative path (`./cover.png`) in frontmatter or MDX body |
| Journal cover + in-body images | `content/journal/<slug>/` (beside `index.mdx`) | Same as above |
| Playground cover | `content/playground/<slug>/` (beside `index.mdx`), or an external URL | Relative path, or `https://...` used as-is |
| Portrait | `public/portait.jpg` | Absolute root path, `/portait.jpg`, set via `PORTRAIT_SRC` in `site.ts` |
| Favicon | `public/favicon.svg` | Linked directly in `index.html` |
| robots.txt / sitemap.xml | `public/robots.txt`, `public/sitemap.xml` | Served as-is at the site root |

**Rule of thumb:** if an image belongs to one specific content item
(a project, post, or experiment), it goes **beside that item's
`index.mdx`** and is referenced with a relative `./` path so Vite bundles,
hashes, and versions it together with that content. If an image is
site-wide/structural (favicon, portrait, robots.txt, sitemap.xml) it goes
in **`public/`** and is referenced with an absolute root path — files in
`public/` are copied as-is, unprocessed and unhashed.

There is also a `figma:asset/...` import resolver configured in
`vite.config.ts` (pointing at `src/assets`) — this is inherited scaffold
from the project's Figma Make origin and has **zero real importers**
anywhere in `src/app`. Don't use this pattern for new content; it's dead
code, not part of the live asset pipeline.

---

## 9. Content architecture

- **MDX files:** `content/{projects,journal,playground}/<slug>/index.mdx`
  — a YAML frontmatter block (` --- ... --- `) followed by a Markdown/MDX
  body.
- **Frontmatter parsing:** `remark-frontmatter` + `remark-mdx-frontmatter`
  (configured in `vite.config.ts`) lift the YAML block into a named
  `frontmatter` export, read by each loader as `mod.frontmatter`.
- **Content types:** 3 are active — `project`, `journal`, `playground` —
  each with its own TypeScript interface in
  `src/app/lib/content/types.ts` and its own loader file
  (`projects.ts`, `journal.ts`, `playground.ts` in the same folder). Four
  more interfaces (`Talk`, `ConferenceNote`, `BookReview`, `Bookmark`)
  exist in `types.ts` as forward-looking scaffolding only — no loader, no
  content directory, no route, no UI. Don't try to author content for
  these yet; nothing will render it.
- **Content loader mechanism:** each loader uses
  `import.meta.glob("/content/<type>/*/index.mdx", { eager: true })` to
  import every matching file synchronously at build time. Any new folder
  under the matching path is picked up automatically — nothing to
  register.
- **Public API:** `src/app/lib/content/index.ts` re-exports everything
  components should use — `getProjects`, `getProjectBySlug`,
  `getFeaturedProjects`, `getJournalPosts`, `getJournalPost`,
  `getFeaturedJournalPost`, `getPlaygroundItems`, `getPlaygroundItem`,
  `formatDate`, plus all the types. This barrel file is the *only* import
  path components should use — never import `lib/content/projects.ts`
  etc. directly.
- **Asset resolution — two separate mechanisms:**
  1. Frontmatter fields (`cover`) → `resolveAsset()` in
     `src/app/lib/content/assets.ts`, backed by a glob of every image
     under `content/`.
  2. MDX-body images (`![alt](./file.png)`) → the custom
     `remarkContentImages` remark plugin
     (`src/app/lib/mdx/remarkContentImages.ts`).

  Both ignore absolute URLs and leave them untouched.
- **Routes:** only 8 route entries exist in `src/app/router.tsx` — `/`,
  `/projects`, `/projects/:slug`, `/journal`, `/journal/:slug`,
  `/playground`, `/playground/:slug`, and a wildcard `*` (404). The
  `:slug` pages resolve dynamically via the content loaders — adding an
  MDX file makes a new page available with zero route changes.
- **Files that should NOT normally be touched for a content-only
  change:** anything under `src/app/lib/content/*.ts` (loaders, types,
  asset resolver, utils), `src/app/lib/mdx/*` (the MDX pipeline),
  `vite.config.ts`, and `src/app/router.tsx`. If you find yourself
  editing one of these to add/change/remove a project, post, or
  experiment, stop — that's very likely not necessary.

---

## 10. Build and deployment workflow

Normal loop after any change:

```bash
npm run build       # regenerates dist/ — the only real correctness signal,
                     # since there is no tsconfig.json / tsc type-check gate
npm run dev          # then manually load the affected route in a browser —
                     # a clean build can still ship a runtime crash
git status           # review what actually changed
git diff             # review the real diff, especially before a broad `git add`
git add <files>      # stage specific files, not `git add -A`
git commit -m "..."
git push
```

**`dist/` is currently tracked in this repository.** `.gitignore` only
excludes `node_modules/` (plus one stray non-matching `README.` line) —
`dist/` is not ignored. Every `npm run build` regenerates content-hashed
filenames under `dist/assets/`, so `git status`/`git diff` after a build
will show a wave of added/deleted/renamed files there — that's expected,
not a sign something broke. The deploy platform (Vercel, per
`vercel.json`) almost certainly builds fresh from source on its own, so
this committed `dist/` is very likely inert for the live deploy, but it
does mean it shows up in your diffs every time.

No environment variables are read anywhere (`import.meta.env.VITE_*` is
unused) — the site is 100% static, nothing to configure for a deploy.

---

## 11. Common mistakes

- **Wrong image path.** Only paths starting with `.` (e.g. `"./cover.png"`)
  get resolved — a path missing the leading `./`, or a typo'd filename,
  fails *differently* depending on where it is: a bad frontmatter `cover`
  path silently falls through unresolved (a broken `<img>`, no build
  error); a bad **MDX-body** image path is a **hard build failure**
  (`Could not resolve "./typo.png"`).
- **Broken frontmatter.** No `tsconfig.json`, no `tsc` run — a missing
  required field or wrong type is never caught at build time. It surfaces
  later as a runtime crash or a silently blank section. Compare new
  frontmatter against an existing published item of the same type before
  trusting it.
- **Duplicate ordering numbers.** `displayIndex` sorts as a **string**.
  Always zero-pad (`"01"`, not `"1"`), or a later `"10"` will sort before
  an earlier `"2"`.
- **Broken links.** `links.github`/`links.live`/etc. are never validated
  — a typo'd URL just renders a dead button silently.
- **Accidental image cropping.** See §2 — a cover renders through
  `object-cover` inside a box whose ratio depends on *where* it's shown
  and whether the project is homepage-dominant. Check a new cover on the
  homepage card, `/projects`, and the detail page before assuming it
  looks right everywhere.
- **Changing a shared component when only content needed changing.**
  `ProjectCard.tsx`, `PlaygroundCard.tsx`, `JournalCard.tsx`,
  `MDX_COMPONENTS` — these render *every* item of their type. A "fix" made
  there for one project/post/experiment's cosmetic issue changes every
  other one too. If only one item looks wrong, the fix is very likely in
  that item's frontmatter/MDX, not in shared component code.
- **Forgetting to build / stale Vite output.** `npm run dev`'s hot reload
  can mask something that only breaks in `npm run build`'s eager,
  fully-static code path — a genuinely different path through Vite's
  plugin pipeline. Always run a real build before considering a change
  done. If a build looks stale after a change, delete Vite's cache
  (`rm -rf node_modules/.vite`) before assuming it's a real bug.
- **Accidentally modifying unrelated projects.** Anything under
  `src/app/lib/content/*.ts` or the shared card components is genuinely
  shared across every item of that content type — before editing one of
  these files, confirm the change is meant to apply to *every* project/
  post/experiment, not just the one you're thinking about.

---

## 12. Quick reference

| Want to change… | Edit… |
|---|---|
| A project's title/description/hook/challenge/impact/tags/links | `content/projects/<slug>/index.mdx` (frontmatter) |
| A project's body/write-up | `content/projects/<slug>/index.mdx` (MDX body) |
| A project's cover image | `content/projects/<slug>/cover.png` + `cover:` path in its `index.mdx` |
| A project's Gallery images | Image files beside `content/projects/<slug>/index.mdx`, referenced via `![alt](./file.png)` in the body |
| `/projects` ordering | `displayIndex` in the relevant projects' `index.mdx` |
| Homepage Selected Work ordering / which project is dominant | `featuredIndex` in the relevant projects' `index.mdx` |
| Whether a project appears on the homepage at all | `featured: true`/`false` in its `index.mdx` |
| Add/remove a project | New/deleted `content/projects/<slug>/` directory + `public/sitemap.xml` |
| A journal post's title/description/excerpt/tags/date | `content/journal/<slug>/index.mdx` (frontmatter) |
| A journal post's body | `content/journal/<slug>/index.mdx` (MDX body) |
| Journal ordering | `publishedAt` (newest first, automatic — no manual index) |
| Add/remove a journal post | New/deleted `content/journal/<slug>/` directory + `public/sitemap.xml` |
| A Playground item's title/summary/tags/links | `content/playground/<slug>/index.mdx` (frontmatter) |
| A Playground item's homepage grid position | `layout.desktop` / `layout.mobile` in its `index.mdx` |
| Add/remove a Playground item | New/deleted `content/playground/<slug>/` directory + `public/sitemap.xml` (and check the homepage grid for gaps) |
| Hero name text | `src/app/components/Hero/Hero.tsx` (`<h1>` spans) |
| Hero tagline | `src/app/components/Hero/Hero.tsx` (`<p>` after the `<h1>`) |
| Hero role line / freelance wording | `src/app/components/Hero/Hero.tsx` (mono-font `<span>` row) |
| Hero "Currently building/learning/…" rotation | `CURRENTLY_ITEMS` in `src/app/content/site.ts` |
| Hero technology/logo pool | `TECHNOLOGIES` array in `src/app/components/shared/TechIcons.tsx` |
| Hero visible logo count / rotation timing | `SLOTS`, `TABLET_SLOT_IDS`, `MIN_INTERVAL_MS`, `JITTER_MS` in `src/app/components/Hero/HeroTechCluster.tsx` |
| About bio paragraphs / quote | `src/app/components/About/About.tsx` (JSX text) |
| About Languages / Currently reading / Based in | `aboutStats` in `src/app/content/site.ts` |
| About portrait image | `public/portait.jpg` + `PORTRAIT_SRC` in `src/app/content/site.ts` |
| Contact email (everywhere) | `CONTACT_EMAIL` in `src/app/content/site.ts` |
| Footer's small-print location text | `src/app/components/Footer/Footer.tsx` (separate hardcoded string) |
| Sitemap entries | `public/sitemap.xml` (fully manual, not generated) |
