# Portfolio — Claude Code Guide

This file is the persistent context for working on this codebase. It was originally written from a full read-through of the source plus a production build, then updated after a follow-up pass that fixed several of the content-system issues it originally documented (see the "Fixed" callouts throughout, and the changelog at the bottom of §15). Where this file and CONTENT_GUIDE.md/CONTENT_MIGRATION.md prose disagree, trust this file — it's verified against the actual code, not aspirational.

---

## 1. Project Overview

A personal developer portfolio + engineering journal for Vijay Krishna (backend engineer, Bengaluru). Single-page application, client-side rendered only — no SSR, no server, no API backend. Content (projects, journal posts, playground experiments) is authored as MDX files and compiled into the client bundle at build time.

The UI/visual design is considered finished. Ongoing work is expected to be content authoring and content-infrastructure changes, not redesign.

## 2. Tech Stack

- **Vite 6.3.5** — build tool and dev server. `npm run dev` (port 5173) / `npm run build` (→ `dist/`). There is **no separate typecheck step** — `build` is literally just `vite build`, which uses esbuild to strip types without checking them.
- **React 18.3.1**, **react-router 7.13.0** in data-router mode (`createBrowserRouter` + `RouterProvider`), all routes lazy-loaded.
- **Tailwind CSS 4.1.12** via `@tailwindcss/vite`, using the CSS-first `@theme` config style (no `tailwind.config.js` file exists — theme tokens live in [src/styles/theme.css](src/styles/theme.css)).
- **MDX** via `@mdx-js/rollup`, with `remark-frontmatter` + `remark-mdx-frontmatter` + `remark-gfm` + a custom `remarkContentImages` plugin (see §8/§9). No rehype plugins are configured.
- **TypeScript** the language, but **not enforced**: there is no `tsconfig.json` anywhere in the project. Files are `.ts`/`.tsx` and Vite/esbuild transpiles them, but nothing ever runs `tsc`. Type annotations are documentation, not a safety net. Note this also means frontmatter shape is never structurally checked even in principle — every loader casts `mod.frontmatter as SomeType`, which `tsc` wouldn't validate against the actual YAML even if it did run.
- No test runner, no linter, no formatter configured.
- `package.json` name is still `@figma/my-make-file` — this project originated from a Figma Make scaffold. A large fraction of `dependencies` (MUI, Emotion, embla-carousel, react-dnd, react-slick, recharts, vaul, cmdk, canvas-confetti, all `@radix-ui/*`, all of `src/app/components/ui/*`) are scaffold leftovers with **zero imports anywhere in `src/app`** outside of the `ui/` folder itself (verified by grep). They are not wired into any page. Do not assume their presence implies they're in use.
- `unist-util-visit` and `acorn` are explicit `devDependencies` used only by `remarkContentImages` (§8/§9) — both were already present transitively via the MDX/remark toolchain before being promoted to direct, pinned entries; they added zero new packages to `node_modules`.

## 3. Architecture

```
index.html                    ← theme-bootstrap inline script, meta tags, mounts #root
src/main.tsx                  ← createRoot().render(<App />)
src/app/App.tsx                ← <RouterProvider router={router} />
src/app/router.tsx             ← createBrowserRouter, all pages lazy()
src/app/components/layout/Layout.tsx  ← route shell: Navbar + <Outlet/> + Footer, owns theme state
src/app/pages/**                ← one component per route
src/app/components/**           ← page-section and shared UI components
src/app/lib/content/**          ← the content API (see §4–5)
src/app/lib/mdx/components.tsx  ← MDX_COMPONENTS style map for rendered MDX bodies
src/app/lib/mdx/remarkContentImages.ts ← resolves relative MDX-body image paths (see §8/§9)
src/app/content/site.ts         ← site configuration (social links, about stats, email) — NOT publishable content
src/app/content/projects.ts     ← ONLY exports `timeline` (biographical data for the Timeline section) — despite the filename, it holds no project data
src/app/types/portfolio.ts      ← legacy display-model types (ThemeMode, TimelineEntry, NavLink, etc.) still actively used by non-content components
src/app/lib/content/types.ts    ← the real content-model types (Project, JournalPost, PlaygroundItem, etc.)
content/**                      ← MDX source files (the actual data)
```

Two type systems coexist and are **not interchangeable**:
- `src/app/types/portfolio.ts` — old "display model" types (`TimelineEntry`, `NavLink`, `SocialLink`, `AboutStat`, `CurrentlyStatusItem`, `ThemeMode`). Still the real types for `Timeline.tsx`, `Navbar.tsx`, `site.ts`. This file also still defines legacy `Project`, `JournalArticle`, `PlaygroundItem` shapes that are **dead** — nothing imports them (superseded by `lib/content/types.ts`), but they haven't been deleted.
- `src/app/lib/content/types.ts` — the real content-model types (`Project`, `JournalPost`, `PlaygroundItem`, `SharedFrontmatter`, etc.) backing the MDX content pipeline.

## 4. Application Flow

End-to-end trace, MDX file → rendered page:

1. **Author** creates `content/<type>/<slug>/index.mdx` with YAML frontmatter + Markdown/MDX body.
2. **Vite dev/build** runs the `@mdx-js/rollup` plugin (registered with `enforce: 'pre'` in [vite.config.ts](vite.config.ts)) on every `.mdx` file. `remark-frontmatter` + `remark-mdx-frontmatter` lift the YAML block into a named export `frontmatter`; `remark-gfm` adds table/strikethrough/autolink support; `remarkContentImages` rewrites any relative `![]()` image reference in the body into a real `import` statement so Vite bundles it (see §8/§9). The MDX body compiles to a default-exported React component.
3. **Content loader** (`src/app/lib/content/{projects,journal,playground}.ts`) uses `import.meta.glob("/content/<type>/*/index.mdx", { eager: true })` to statically import **every** matching MDX file at build time (eager = no lazy chunk, no runtime fetch — everything is baked into the JS bundle synchronously, including drafts).
4. For each module, the loader builds a plain object: `{ slug, ...withoutFrontmatterSlug(frontmatter), Component: mod.default }` — `slug` always comes from the directory name; a `slug` key inside the frontmatter is explicitly stripped before the spread and can never win (see §5). It then runs `resolveAsset()` on `cover` to turn `"./cover.png"`-style relative paths into Vite-hashed URLs.
5. **Public API** ([src/app/lib/content/index.ts](src/app/lib/content/index.ts)) re-exports `getProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getJournalPosts`, `getJournalPost`, `getFeaturedJournalPost`, `getPlaygroundItems`, `getPlaygroundItem`, plus all types and `formatDate`. This barrel is the **only** import path components should use — never import `lib/content/projects.ts` etc. directly.
6. **Pages/components** (`ProjectsIndex`, `SelectedWork`, `ProjectDetail`, etc.) call these functions, get back typed objects, and render. Detail pages pull the paired `Component` off the item and render it as `<Body components={MDX_COMPONENTS} />` — this is how the MDX body actually reaches the DOM, styled via the shared component map in `lib/mdx/components.tsx`.
7. **Router** resolves `/projects/:slug` etc. via `useParams()` → `getProjectBySlug(slug)`; a miss triggers `<Navigate to="/404" replace />`, which falls through to the router's wildcard `*` route (see §10).

## 5. Content Architecture

### Directory structure

```
content/
  projects/<slug>/index.mdx (+ optional images alongside)
  journal/<slug>/index.mdx
  playground/<slug>/index.mdx
  templates/{project,journal,playground}-template.mdx   ← copy these to start new content
  drafts/                                                 ← empty, for keeping WIP MDX out of the published dirs entirely
  assets/                                                 ← empty, unused
```

Every content directory also has a stray `.gitkeep` file alongside `index.mdx` (harmless, left over from scaffolding empty dirs before content existed).

### Slug generation

**The directory name is always the slug — full stop, no exception.** All three loaders explicitly strip any `slug` key out of the parsed frontmatter (via a small `withoutFrontmatterSlug()` helper in [utils.ts](src/app/lib/content/utils.ts)) before merging it with the directory-derived slug, so a frontmatter `slug:` field can never take effect no matter what it's set to. The three `templates/*.mdx` files do not include an example `slug:` field, so there's nothing to imitate that would suggest otherwise.

*(This wasn't always true — see the §15 changelog. Earlier, the loaders did `{ slug: dirName, ...frontmatter }`, and because the spread ran after `slug` was set, a frontmatter `slug:` field would silently win. That's now fixed at the loader level, not just documented.)*

### Required vs optional fields, ordering, status, featured — see §7 for the full schema.

- **Ordering**: projects sort by `displayIndex` (string `localeCompare`, so `"01" < "02" < "10"` works lexically only because they're zero-padded — an unpadded `"9"` vs `"10"` would sort wrong). Journal posts sort newest-first by `publishedAt` (`Date` parse, descending). Playground items have no sort — they render in whatever order `import.meta.glob` returns (directory read order, not guaranteed to match creation order).
- **Published/draft filtering**: every `get*()` list/single function filters via a shared `isPublished()` helper ([utils.ts](src/app/lib/content/utils.ts)) that trims whitespace and lowercases before comparing to `"published"` — so `"Published"`, `" published"`, etc. now still count as published rather than silently vanishing. `getProjects()`/`getPlaygroundItems()`/`getJournalPosts()` never return drafts or archived items; `getProjectBySlug()` etc. return `undefined` for a draft slug, which the detail pages treat as a 404.
- **Featured (projects)**: `getFeaturedProjects()` is now the function the homepage actually calls — `SelectedWork.tsx` renders `getFeaturedProjects()`, not the unfiltered `getProjects()`. Setting `featured: true`/`false` on a project's frontmatter directly controls whether it appears in the homepage "Selected Work" section; it has no effect on the `/projects` index page, which always shows every published project regardless of `featured`.
- **Featured (journal)**: `getFeaturedJournalPost()` searches the already date-sorted `getJournalPosts()` list (so "newest featured wins" if more than one post is ever marked `featured: true`, matching what CONTENT_GUIDE.md claims), and **falls back to the newest published post** if nothing is explicitly featured — it can only return `undefined` if there are zero published journal posts on the entire site. `Journal.tsx` no longer uses a non-null assertion; it early-returns `null` in that all-zero-posts edge case instead of crashing.

### MDX body images now resolve — read this before assuming otherwise

[src/app/lib/mdx/remarkContentImages.ts](src/app/lib/mdx/remarkContentImages.ts) is a custom remark plugin (registered in [vite.config.ts](vite.config.ts)) that walks the MDX body's syntax tree, finds every Markdown image node (`![alt](url)`) whose `url` starts with `.` (the same relative-path test `resolveAsset()` uses), and rewrites it into a real `import` statement plus a JSX `<img src={...}>` — the same technique `remark-mdx-frontmatter` already used internally to inject `export const frontmatter`. Because it's now a genuine static `import`, Vite's own asset pipeline bundles and hashes it exactly like any other image import in the codebase. Absolute URLs (`https://...`) are left completely untouched, matching `resolveAsset()`'s own behavior for frontmatter fields.

Practical effect: `![Architecture diagram](./architecture.png)` in a project/journal/playground body now works exactly like it looks like it should — no workaround needed, no absolute-URL requirement. This was verified against both `npm run dev` and `npm run build` with a disposable test fixture before shipping.

**One sharp edge this introduces**: because the browser used to silently show a broken image for a bad relative path, and now Vite tries to resolve it as a real module import, **a body image reference to a file that doesn't exist is now a hard build failure** (`Could not resolve "./typo.png"`), not a silently-broken `<img>`. This is strictly better (you find out immediately, at build time, instead of a visitor finding a broken image in production) but it means a typo'd filename in a body image will stop `npm run build` cold until fixed — see §15.

### Image/asset resolution — the full picture

[src/app/lib/content/assets.ts](src/app/lib/content/assets.ts) does the frontmatter-side work:

```ts
const contentImages = import.meta.glob<string>(
  "/content/**/*.{png,jpg,jpeg,gif,webp,svg,avif}",
  { eager: true, query: "?url", import: "default" },
);
```

This eagerly globs **every image file anywhere under `content/`**, regardless of which content item it belongs to or whether that item is published. `resolveAsset(rawPath, contentDir)` only transforms strings starting with `"."` (i.e. `"./cover.png"`); anything else (an `https://` URL, or an empty string) passes through unchanged. It's called explicitly, and only, from the three loaders' `cover` handling.

| Reference | Where | Resolved by Vite? |
|---|---|---|
| `cover: "./cover.png"` in frontmatter | loader calls `resolveAsset()` explicitly | ✅ Yes — becomes a hashed `/assets/...` URL |
| `cover: "https://images.unsplash.com/..."` in frontmatter | `resolveAsset()` returns it unchanged | N/A — used as-is, browser fetches directly from the URL |
| `![Alt](./diagram.png)` inside the **MDX body** | `remarkContentImages` rewrites it into a real `import` before Vite ever sees it as markup | ✅ Yes, as of the fix in §15's changelog |
| `![Alt](https://...)` inside the **MDX body** | Left untouched by `remarkContentImages` | N/A — used as-is |

Note: because the asset glob in `assets.ts` runs over **all** of `content/`, not just published items, images belonging to `draft` content are still bundled into the production output (verified: the production build includes a 3.1 MB image sourced from a draft project's `cover.png` — it's shipped to every visitor even though the project it belongs to never renders). Marking something `draft` hides it from the UI; it does not exclude its assets from the bundle. This was investigated and deliberately left as-is — see §15/§16.

## 6. Content Management Rules

### Add a project

```bash
mkdir content/projects/your-project-slug
cp content/templates/project-template.mdx content/projects/your-project-slug/index.mdx
# add cover.png (and any images the body references) into that same directory
```

- Do not add a `slug:` field to the frontmatter — it's ignored (see §5). The directory name is always the URL.
- Fill in every required field from §7's Project table. Leave `status: draft` until ready.
- Reference the cover as `cover: "./cover.png"` (resolved by the loader) or a full `https://` URL (used as-is).
- For in-body images, `![alt](./image.png)` now works — just make sure the file actually exists at that relative path, or the build will fail (see §5's sharp-edge note).
- Want a project on the homepage's "Selected Work" section too? Set `featured: true`. It shows on `/projects` either way once published.
- Want extra external links beyond GitHub/live demo? `links.writeup` and `links.caseStudy` both render as buttons now, same as `links.github`/`links.live` — fill in whichever apply, leave the rest empty or omitted.
- Flip `status: draft` → `status: published` when ready to ship. There's no build step required beyond the normal dev-server hot reload / next production build — `import.meta.glob({ eager: true })` picks up new files automatically once Vite reprocesses.
- Manually add the new URL to `public/sitemap.xml` — nothing generates this file automatically (see §14).

### Edit a project

Edit `content/projects/<slug>/index.mdx` directly — frontmatter and body both live in that one file. Never edit anything under `dist/` (build output) or expect changes to `src/app/content/projects.ts` to affect published projects — that file only holds the unrelated `timeline` array (see §3).

### Delete a project

Delete the entire `content/projects/<slug>/` directory. Nothing else references it by path, so no other file needs updating — **except** `public/sitemap.xml`, which must be edited by hand to remove the stale URL (it is not derived from content at build time; see §16).

The same three operations (add/edit/delete) apply identically to **Journal** (`content/journal/<slug>/`) and **Playground** (`content/playground/<slug>/`), substituting the relevant template and frontmatter schema from §7. Journal-specific note: you no longer need to keep exactly one `featured: true` post as a safety requirement — `getFeaturedJournalPost()` falls back to the newest post automatically — but it's still good practice to pick one deliberately if you want a specific post to be the homepage's big featured card rather than whatever happens to be newest.

## 7. Frontmatter Schemas

All three types extend `SharedFrontmatter` ([types.ts](src/app/lib/content/types.ts)):

| Field | Type | Required | Purpose |
|---|---|---|---|
| `type` | `"project" \| "journal" \| "playground"` | yes | Discriminant; must match the content directory, but nothing actually validates the match — it's not read by any loader, only by the (dead) generic `ContentItem` union machinery |
| `title` | `string` | yes | Rendered as page/card heading |
| `description` | `string` | yes | Card/meta description text |
| `status` | `"published" \| "draft" \| "archived"` | yes | Tolerant match (trimmed, case-insensitive) via `isPublished()` — see §5 |
| `publishedAt` | `string` (ISO date) | yes | Sort key (journal); displayed via `formatDate()` |
| `updatedAt` | `string` | no | Declared in the type; **not read anywhere in the codebase** |
| `tags` | `string[]` | yes | Only `tags[0]` is ever displayed (cards/detail headers show a single tag, not the full list) |
| `cover` | `string` | yes for project/playground, optional in the shared base | See §5/§9 for resolution rules |
| `coverAlt` | `string` | yes (project), unused (journal/playground use `title` as alt) | Alt text |

Note: a `slug` field is intentionally **not** part of the schema you should set — see §5. If you write one anyway it's silently discarded, not an error.

**Project-specific** (extends the above):

| Field | Type | Required | Purpose |
|---|---|---|---|
| `year` | `string` | yes | Free-text display range, e.g. `"2021 – 2022"` |
| `challenge` | `string` | yes | Shown in card + detail "Engineering Challenge" block |
| `technologies` | `string[]` | yes | Rendered as pill list on card and detail page |
| `impact` | `string` | yes | Shown in card + detail "Impact" block |
| `displayIndex` | `string` | yes | Zero-padded numeric string controlling sort order (`"01"`, `"02"`, ...) — see the lexical-sort caveat in §5 |
| `displayLayout` | `"default" \| "flip"` | yes | Whether the cover image sits right (`default`) or left (`flip`) of the text in the card |
| `featured` | `boolean` | yes | Controls the homepage "Selected Work" section — see §5. Does **not** affect the `/projects` index, which always shows everything published. |
| `hook` | `string` | no | One-line tagline shown under the title on the detail page hero, only if present |
| `role` | `string` | no | Shown in detail-page meta row and card, only if present |
| `links.github` / `links.live` / `links.writeup` / `links.caseStudy` | `string` | no | All four now render as buttons on the detail page, each only if non-empty |

`gallery`, `techStack`, and `nextProject` were removed from the schema (they were typed and loaded but never rendered by any component — see §15's changelog). If you want supplementary images beyond the cover, put them in the MDX body as `![alt](./image.png)` under a `## Gallery` heading — that's the one supported mechanism now, and it works (§5).

**Journal-specific:**

| Field | Type | Required | Purpose |
|---|---|---|---|
| `excerpt` | `string` | yes | Card summary and detail-page subheading |
| `readTime` | `string` | yes | Free text, e.g. `"8 min"` — set by hand, nothing computes it |
| `featured` | `boolean` | yes | See §5's fallback behavior — safe to leave unset, but pick one deliberately if you want a specific post featured |
| `body` | `string` | no | Declared in the type; **not used** — the MDX body is rendered via the `Component` function, not a string field |

**Playground-specific:**

| Field | Type | Required | Purpose |
|---|---|---|---|
| `summary` | `string` | yes | Shown on cards (grid tiles) |
| `cover` | `string` | yes | Now guarded with a conditional in every place it renders (`PlaygroundCard`, `PlaygroundIndex`, `PlaygroundDetail`) — a missing cover omits the image block instead of showing a broken `<img>` |
| `layout.desktop` / `layout.mobile` | `string` (Tailwind classes) | yes | Raw grid-placement utility classes, e.g. `"col-start-4 col-span-1 row-start-1 row-span-1"` — hand-authored per item; the home page grid is a fixed 4-col × 2-row layout and adding a 5th item requires manually rebalancing every item's classes (per CONTENT_GUIDE.md, this is not automatic) |
| `demoUrl` / `sourceUrl` | `string` | no | Rendered as buttons on the detail page, only if present |
| `body` | `string` | no | Same as journal — declared, unused |

Also note: `types.ts` defines full interfaces for four more content types (`Talk`, `ConferenceNote`, `BookReview`, `Bookmark`) and includes them in the `ContentItem` union — **none of these have a loader, a content directory, a route, or any UI**. They are forward-looking scaffolding only.

## 8. MDX System

Configured entirely in [vite.config.ts](vite.config.ts):

```ts
mdx({
  remarkPlugins: [
    remarkFrontmatter,
    [remarkMdxFrontmatter, { name: "frontmatter" }],
    remarkGfm,
    remarkContentImages,
  ],
})
```

- **Frontmatter**: `remark-frontmatter` parses the leading `---` YAML block; `remark-mdx-frontmatter` lifts it into a named export `frontmatter` (accessed by loaders as `mod.frontmatter`). Not exported as a default JS object usable in the body itself.
- **GFM** (`remark-gfm`): tables, strikethrough, autolinks, and task lists are supported in the body (standard remark-gfm feature set).
- **`remarkContentImages`** ([src/app/lib/mdx/remarkContentImages.ts](src/app/lib/mdx/remarkContentImages.ts)): custom, repo-local plugin. Rewrites relative body image references into real `import` statements so Vite bundles them — see §5/§9 for the full explanation. Built with `unist-util-visit` (tree walking) and `acorn` (constructing the injected `import` statement's AST), both already-vendored transitive dependencies promoted to explicit `devDependencies`.
- **No rehype plugins** — no syntax highlighting, no heading-ID/anchor generation. Code blocks render as plain `<pre><code>` with the raw text, styled by `MDX_COMPONENTS.pre`/`.code` but with **no syntax highlighting whatsoever** despite the visual styling implying a code block (fenced code with a language tag like ` ```typescript ` has zero effect on rendering — the language tag is simply discarded).
- **Custom component map**: [src/app/lib/mdx/components.tsx](src/app/lib/mdx/components.tsx) exports `MDX_COMPONENTS`, a plain object mapping `h1`–`h3`, `p`, `ul`/`ol`/`li`, `strong`, `em`, `code`, `pre`, `blockquote`, `hr`, `a`, `img` to styled React components. This is passed explicitly at the render call site: `<Body components={MDX_COMPONENTS} />` in each detail page — it is **not** wired globally via an MDXProvider, so any new page that renders an MDX `Component` without passing this prop will get unstyled default HTML tags instead. This applies uniformly to `<img>` tags regardless of whether they came from literal Markdown syntax or from `remarkContentImages`'s rewrite — both compile to the same JSX `img` element and get styled identically.
- **JSX-in-MDX**: because this is true MDX (not plain Markdown), raw JSX expressions (`{...}`) and comments (`{/* ... */}`) work in the body — used in the templates for the `{/* Cover image is automatic... */}` comment. Also means MDX parses `<` followed immediately by a letter/number as a JSX tag open — see the `<50` gotcha in §15.
- No `h4`–`h6`, no custom table styling (falls back to unstyled default `<table>`), no custom image gallery/lightbox component (the body-image mechanism from §5/§9 is what stands in for a gallery today).

## 9. Image and Asset Rules

Given a content item:

```
content/projects/example/
├── index.mdx
├── cover.png
└── architecture.png
```

| You write | What handles it | Result |
|---|---|---|
| `cover: "./cover.png"` (frontmatter) | `resolveAsset()` in the loader, backed by Vite's `import.meta.glob(..., { query: "?url" })` | Rewritten to a hashed `/assets/cover-<hash>.png` URL at build time. Works in dev and prod. |
| `cover: "https://images.unsplash.com/..."` (frontmatter) | Nothing — passed through as-is | Browser fetches directly from that host at runtime. No local processing, no license/attribution check. |
| `![Architecture](./architecture.png)` (inside MDX body) | `remarkContentImages` (a custom remark plugin, see §8) rewrites this into a real `import` before compilation finishes | ✅ Bundled and hashed by Vite exactly like the cover image. Verified in both `npm run dev` and `npm run build`. |
| `![Architecture](https://...)` (inside MDX body) | Nothing — passed through as-is | Same as an absolute-URL cover: fetched directly from that host. |

The `gallery: GalleryImage[]` frontmatter field that used to exist for this purpose has been removed from the schema — it was loaded and asset-resolved but never rendered by any component. Use body images under a `## Gallery` heading instead; that's now the one working mechanism, and it's what every real content file already does stylistically.

**Important consequence of the body-image fix**: a relative image reference to a file that doesn't exist is now a **build-time failure**, not a silently-broken `<img>`. Double-check filenames/extensions/case before committing — Vite's error message will name the exact unresolvable path if you get it wrong.

`public/portait.jpg` (note: filename is missing the second "r" — `portait`, not `portrait`) is the About-section portrait, referenced by `PORTRAIT_SRC = "/portait.jpg"` in [site.ts](src/app/content/site.ts). This is a real, load-bearing filename — don't "fix" the typo by renaming the file without also updating the constant, or vice versa.

## 10. Routing

Defined in [src/app/router.tsx](src/app/router.tsx), a single `createBrowserRouter` tree with `Layout` as the root element (providing Navbar/Footer/theme) and all page components lazy-loaded:

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Composes Hero, SelectedWork, Timeline, Journal, Playground, About in a fixed order — all in one long scrolling page; nav links to `/#work` etc. are anchor scrolls to `id`s on these sections |
| `/projects` | `ProjectsIndex` | Lists all published projects (not filtered by `featured`) |
| `/projects/:slug` | `ProjectDetail` | `getProjectBySlug(slug)`; not found → `<Navigate to="/404" />` |
| `/journal` | `JournalIndex` | Lists all published posts |
| `/journal/:slug` | `JournalDetail` | `getJournalPost(slug)`; not found → `<Navigate to="/404" />` |
| `/playground` | `PlaygroundIndex` | Grid of all published items |
| `/playground/:slug` | `PlaygroundDetail` | `getPlaygroundItem(slug)`; not found → `<Navigate to="/404" />` |
| `*` (wildcard) | `NotFound` | Catches unknown paths **and** the `/404` path that detail pages redirect to — there is no dedicated `/404` route; it works only because `*` matches literally anything not matched above |

**Adding an MDX file does make a new page available automatically** (no route needs to be registered) — the detail-page routes are parameterized by `:slug` and resolve dynamically via the content loader, not via per-item static routes. Only the three index routes and three detail-route *shapes* are statically defined; the actual pages that exist under them are 100% content-driven.

`react-router`'s `ScrollRestoration` is used in `Layout`, so browser back/forward preserves scroll position per the library's default heuristics.

## 11. Design System

Do not redesign any of this — it's documented so future changes don't accidentally break it.

- **Fonts** ([fonts.css](src/styles/fonts.css)): Google Fonts import — `DM Serif Display` (headings/display, `--font-display`), `DM Sans` (body, `--font-sans`), `JetBrains Mono` (labels/meta/code, `--font-mono`). Applied via inline `style={{ fontFamily: "var(--font-display)" }}` on individual elements rather than Tailwind font-family utility classes — this is the dominant pattern throughout the codebase, not an inconsistency to "clean up."
- **Colors** ([theme.css](src/styles/theme.css)): CSS custom properties on `:root` (light) and `.dark` (dark), consumed via Tailwind 4's `@theme inline` block, which maps `--color-*` tokens to the `--background`/`--foreground`/etc. variables. Brand accent is `#68b1f5` (blue) — also exported as `BRAND_BLUE` in [interaction.ts](src/app/lib/interaction.ts), though most components hardcode the hex literal directly in Tailwind arbitrary-value classes (`text-[#68b1f5]`) rather than importing the constant. A secondary accent `#ffdf60` (yellow) appears for "Impact" callouts and small decorative marks — this constant is **not** centralized anywhere; it's a repeated literal.
- **Light palette**: warm off-white background (`#f7f5f0`), near-black foreground (`#1a1714`). **Dark palette**: deep indigo/near-black background (`#131118`), warm off-white foreground (`#ece9e4`) — note the dark theme isn't just an inverted light theme; it shifts hue (indigo tint) rather than being pure grayscale.
- **Spacing/layout**: `Container` component caps content at `max-w-[1320px]` with responsive `px-6 md:px-10`. Sections use large vertical rhythm (`py-36` is the standard section padding). Borders (`border-border`, a low-alpha foreground color) are used pervasively as separators instead of shadows/cards — the entire site's structure leans on hairline borders, not elevation.
- **Cards**: no shared `Card` component for content — `ProjectCard`, `JournalCard`, `PlaygroundCard` are each bespoke, sharing only the `INTERACTION` utility classes and color tokens. The generic shadcn `ui/card.tsx` exists but is unused (see §16).
- **Buttons**: `Button`/`ButtonLink` in [shared/Button.tsx](src/app/components/shared/Button.tsx) — three variants (`solid`, `outline`, `nav`), duplicated variant-class logic between the two components rather than shared.
- **Navbar**: fixed position, transparent until `scrollY > 40px` (`NAV_SCROLL_THRESHOLD`), then gains a blurred background + bottom border. Active-link detection is `pathname === href || pathname.startsWith(href + "/")`.
- **Timeline**: single-open accordion (`useState<number|null>`) — opening one entry closes any other.
- **Portrait/tech icons**: `TechStrip.tsx` hand-draws 8 technology icons as inline SVG (not an icon font/library) — see §16 for the mismatch between this hardcoded list and the site's actual `CURRENTLY_ITEMS`/tags.
- **Responsive**: Tailwind breakpoint-prefixed classes throughout (`md:`, `lg:`); no separate mobile components — same JSX, different classes (e.g. Playground grid switches from a 4×2 desktop grid to a 2-col mobile grid via two separately-rendered `Reveal` blocks with `hidden md:grid` / `md:hidden`).

## 12. Animation and Interaction System

- **`Reveal`** ([shared/Reveal.tsx](src/app/components/shared/Reveal.tsx)): the one entrance-animation primitive used everywhere. Wraps children in a div, uses `IntersectionObserver` (threshold `0.08`, `rootMargin: "0px 0px -32px 0px"`) to trigger a one-time opacity+translateY transition (`300ms ease-out`) when scrolled into view, with an optional `delay` prop (ms) for staggering sibling items (commonly `index * 60` or `index * 80`).
- **Reduced motion**: `usePrefersReducedMotion()` ([hooks/usePrefersReducedMotion.ts](src/app/hooks/usePrefersReducedMotion.ts)) watches `(prefers-reduced-motion: reduce)` via `matchMedia` + the modern `addEventListener("change", ...)` API (no deprecated `addListener`). `Reveal` checks this and, if true, skips the IntersectionObserver entirely and renders children immediately/unstyled (still preserving the `className` prop for layout). `HeroStatus` also checks it directly to disable its own rotation timers.
- **Hero rotation**: `HeroStatus.tsx` cycles through `CURRENTLY_ITEMS` (from `site.ts`) every 4.5s, with a 180ms fade-out/fade-in crossfade, pausable on hover/focus (`isPaused` state), and fully disabled under reduced-motion.
- **Shared interaction tokens**: [lib/interaction.ts](src/app/lib/interaction.ts) exports `INTERACTION`, a small object of reusable Tailwind transition-class strings (`fast`, `color`, `border`, `lift`, `subtleLift`, `underline`, `fadeMove`, `icon`) — used instead of writing `transition-*` classes ad hoc, so hover/lift timing stays consistent across cards, links, and buttons. Durations cluster around 200–300ms with `ease-out`.
- **Hover interactions**: card lift (`hover:-translate-y-1` / `-0.5` + shadow) via `INTERACTION.lift`/`subtleLift`; underline-grow via `INTERACTION.underline` (`w-0` → `w-full` on group-hover); image zoom (`group-hover:scale-[1.05]`) on Playground/project card thumbnails.

## 13. Theme System

Verified from [index.html](index.html), [Layout.tsx](src/app/components/layout/Layout.tsx), and [constants.ts](src/app/lib/constants.ts):

1. **Bootstrap (pre-paint)**: an inline `<script>` in `index.html`'s `<head>` runs synchronously before any CSS/React loads. It reads `localStorage.getItem("theme")`, falls back to `window.matchMedia("(prefers-color-scheme: dark)")`, and adds the `dark` class to `<html>` if applicable. This exists specifically to prevent a flash of the wrong theme on load.
2. **React hydration**: `Layout.tsx`'s `resolveInitialTheme()` reads the *exact same sources in the exact same priority order* (`localStorage` → system preference → light) as a `useState` lazy initializer, so React's first render never disagrees with what the bootstrap script already painted.
3. **Toggle**: `Navbar`'s sun/moon button calls `toggleTheme()` (owned by `Layout`, passed down as a prop), which flips the state, `classList.toggle("dark", ...)`s on `<html>` via a `useEffect`, and persists the explicit choice to `localStorage` under the key `"theme"` (`THEME_STORAGE_KEY` in [constants.ts](src/app/lib/constants.ts) — this string literal must stay in sync with the hardcoded `"theme"` key in the `index.html` inline script; they are two separate copies of the same string, not a shared constant, because the inline script runs before any JS module graph exists).
4. **Persistence**: once a user explicitly toggles, that choice is sticky across reloads (localStorage wins over system preference from then on). Until the first toggle, the site follows the OS-level `prefers-color-scheme`, live — but note there's no `matchMedia` change-listener wired up post-mount in `Layout`, so if the OS preference changes while the tab is open and no explicit choice has ever been saved, the theme will not update until next reload.
5. Both `localStorage` reads are wrapped in `try/catch` (returns light theme on failure — relevant for privacy modes / disabled storage).

## 14. Deployment

- **Build**: `npm run build` → `vite build` → static output in `dist/`. No environment variables are read anywhere in the app (confirmed no `import.meta.env.VITE_*` usage) — the site is 100% static, no runtime config needed.
- **Dev**: `npm run dev` → Vite dev server on port 5173 (matches `.claude/launch.json`'s configured preview).
- **Platform**: Vercel. [vercel.json](vercel.json) contains only an SPA rewrite rule (`"/(.*)" → "/index.html"`) — necessary because this is a client-side router; without it, a direct load of e.g. `/projects/foo` would 404 at the CDN edge before React Router ever runs.
- **SEO files**: `public/robots.txt` (allow-all, points to sitemap) and `public/sitemap.xml` (hand-maintained list of URLs) both hardcode the domain `vijaykrishna.dev`. `index.html` also hardcodes this domain in `<link rel="canonical">` and Open Graph/Twitter meta tags. **None of these are generated from content** — adding/removing a content item does not update the sitemap; that's a manual step (§6, §16).
- **Favicon**: `public/favicon.svg`, linked in `index.html`.
- **What could break after deploy but "work locally"**: nothing environment-dependent was found (no env vars, no server-only code paths) — but see §16 for the committed-`dist/`-goes-stale risk, which is a deploy-hygiene issue rather than a functional break.

## 15. Known Gotchas

- **A body image reference to a nonexistent file is now a hard build failure**, not a silently-broken `<img>` (a direct, intentional consequence of the §5/§9 fix). If `npm run build` suddenly fails with `Could not resolve "./something.png"`, it's almost always a typo'd filename/extension/case in an MDX body — go check the file actually exists at that path next to `index.mdx`.
- **MDX interprets `<` + digit as JSX.** Writing `<50` in a body paragraph (e.g. "latency <50ms") will fail to compile/parse as Markdown — MDX reads it as an unclosed JSX tag. Write `under 50` or `&lt;50` instead. (This is documented in CONTENT_GUIDE.md and is accurate. Not something the image fix touches.)
- **No type-checking gate.** There is no `tsconfig.json` and `npm run build` never runs `tsc`. A frontmatter object that violates the `Project`/`JournalPost`/`PlaygroundItem` interface (wrong field name, missing required field, wrong type) will not be caught at build time — it will only surface as a runtime rendering bug (e.g. `undefined.map is not a function`) or a silently blank section. Even adding `tsconfig.json` wouldn't fully close this gap, since every loader ingests frontmatter via an `as` cast that defeats structural checking — a real fix would need a runtime frontmatter validator, which was investigated and deliberately deferred (§16).
- **`displayIndex` sorts lexically, not numerically.** `"01"` < `"02"` < ... < `"09"` works only as long as every value is zero-padded to the same width. An unpadded `"10"` would sort before `"2"`.
- **Draft content's images still ship in the production bundle.** The asset glob in `assets.ts` scans all of `content/` unconditionally; only the loader's `status` filter hides an item from the *rendered* site. A large image (verified: 3.1 MB) belonging to a draft-only project was present in a from-scratch production build. Investigated and deliberately left as-is — see §16 for why.
- **CONTENT_GUIDE.md and CONTENT_MIGRATION.md describe a plan, not always the current reality.** CONTENT_MIGRATION.md's "Phase 2" section presents a **hypothetical future** `fs`/`gray-matter`-based implementation (`readdirSync`, `matter()`) as if it were a pending TODO — but the project already migrated to the Vite `import.meta.glob`-based eager-MDX-compilation approach documented in §4–5, which is architecturally different (build-time bundling vs. a Node filesystem read). Treat CONTENT_MIGRATION.md as a historical planning document, not a description of the live system. (CONTENT_GUIDE.md, by contrast, is now fully accurate — its slug/body-image claims used to describe intent rather than reality, and the code was changed to match it rather than the other way around.)

### Changelog — fixed in this pass (previously documented here as live gotchas)

- ~~Frontmatter `slug` silently overrides the directory name~~ — **fixed**. All three loaders now strip `slug` from parsed frontmatter before merging (§5).
- ~~Relative image paths inside the MDX body are not resolved~~ — **fixed**. `remarkContentImages` resolves them (§5/§8/§9).
- ~~`status` is a brittle exact-string match~~ — **fixed**. `isPublished()` trims and lowercases before comparing (§5).
- ~~`getFeaturedJournalPost()!` crashes the homepage if zero posts are featured~~ — **fixed**. Falls back to the newest published post; `Journal.tsx` no longer uses a non-null assertion (§5).
- ~~`Project.featured`/`getFeaturedProjects()` has no caller~~ — **fixed**. `SelectedWork.tsx` now calls it (§5).
- ~~`gallery`, `techStack`, `nextProject` frontmatter fields are typed/loaded but never rendered~~ — **fixed by removal**. Deleted from the schema; body images are the one supported way to add supplementary images now (§7/§9).
- ~~`links.writeup`/`links.caseStudy` are typed but never rendered~~ — **fixed**. Both now render as buttons on the project detail page, same pattern as `links.github`/`links.live` (§7).
- ~~`PlaygroundCard`/`PlaygroundIndex` render `<img src={item.cover}>` with no guard~~ — **fixed**. Wrapped in the same `{item.cover && (...)}` conditional `PlaygroundDetail` already used.

## 16. Observed Issues / Things to Investigate

Investigated during a content-system audit; deliberately **not** fixed (out of scope for that pass, or a genuine tradeoff rather than a bug). Don't fix these without a specific reason to revisit them.

- **Draft content's images still ship in the production bundle** (the asset glob in `assets.ts` scans all of `content/` regardless of status). This is a bloat/exposure concern, not a "breaks or hides content" concern. A real fix would require restructuring how/when the asset glob runs relative to knowing an item's status — a genuine chicken-and-egg (you need the frontmatter to know the status, but the asset glob and the frontmatter parse are currently independent, decoupled by design). That's an architecture change to the loading strategy, not a targeted content-system fix. Practical mitigation: don't put large images in a draft item's directory until it's ready to publish.
- **No runtime frontmatter validator.** Since `tsc` never runs and every loader casts frontmatter via `as`, a malformed content file currently fails silently or with a confusing downstream error rather than a clear "field X is missing in content/projects/Y" message. A hand-rolled required-field check per content type (thrown at load time, naming the offending file) would genuinely help future content-only edits — but it's a larger, separate piece of infrastructure than a content-system audit's fixes, and worth its own dedicated pass rather than bundling in.
- **The entire shadcn/ui component library (`src/app/components/ui/*`, ~45 files) is unused.** Verified via grep: nothing under `src/app` outside that folder imports from `components/ui/`. Likewise `src/app/components/figma/ImageWithFallback.tsx` and `src/app/hooks/useActiveSection.ts` have no importers anywhere. The `figma:asset/` resolver plugin in `vite.config.ts` also has no matching `import "figma:asset/..."` anywhere in `src/app`. All scaffold leftovers from the project's Figma Make origin.
- **`public/sitemap.xml` is already out of sync with actual content.** It lists `https://vijaykrishna.dev/projects/multi-tenant-api-gateway`, but no `content/projects/multi-tenant-api-gateway/` directory exists anywhere in the repo. Conversely, it has no entry for a hypothetical newly-added item unless someone remembers to add one by hand.
- **`dist/` (build output) is committed to git** — `.gitignore` only excludes `node_modules/` (plus a `README.` line that doesn't match any real filename in the repo, likely leftover/typo). Since Vercel almost certainly runs its own build from source, this checked-in `dist/` is probably inert, but it is dead weight in the repo and a footgun if anything ever serves it directly instead of running a fresh build.
- **`src/styles/globals.css` exists and is imported nowhere, and is empty.** `src/styles/index.css` (the real entry point, imported from `main.tsx`) imports `fonts.css`, `tailwind.css`, `theme.css` — not `globals.css`.
- **No syntax highlighting on fenced code blocks**, despite templates/journal content using language-tagged fences (` ```typescript `). The `pre`/`code` MDX component styling implies a "real" code block visually, but the language tag has zero functional effect — this may or may not be intentional; flagging since it's a common expectation gap for a technical journal.
- **`readTime` is manually authored free text**, not computed — CONTENT_MIGRATION.md mentions installing a `reading-time` package for this, but it's not in `package.json` and no such computation exists anywhere in the code.

## 17. Rules for Future Changes

- **Content files are data. Components are presentation.** Keep those concerns separate — never hardcode a piece of publishable content (a project, a post, an experiment) into a `.tsx` file; it belongs under `content/`.
- Prefer minimal changes. Do not redesign existing UI unless explicitly requested — the visual language documented in §11–13 is considered finished.
- Do not replace the MDX/`import.meta.glob` architecture with the `fs`/`gray-matter` approach described in CONTENT_MIGRATION.md — that document predates the current (already-shipped) implementation and describes a different, unbuilt system. If you need to change the content pipeline, change the actual `import.meta.glob`-based loaders in `lib/content/*.ts`, not the aspirational code samples in that markdown file.
- Do not duplicate content between TypeScript and MDX. `src/app/content/projects.ts` is legacy-named but currently holds only the `timeline` array (biographical, not publishable) — don't be misled by the filename into adding project data there.
- Content should normally be changed through the `content/` directory, per §6. Reserve edits to `lib/content/*.ts` for genuine schema/pipeline changes, not for adding a single new piece of content.
- Reuse existing components and utilities — `INTERACTION` tokens, `Reveal`, `Container`, `SectionLabel`, the `MDX_COMPONENTS` map, `isPublished()`/`withoutFrontmatterSlug()` in `lib/content/utils.ts` — rather than introducing parallel ad hoc logic.
- Preserve the existing interaction language (transition durations/easings in `INTERACTION`, the `Reveal` entrance pattern, hover-lift conventions) when adding new sections.
- Preserve reduced-motion support: any new animation must check `usePrefersReducedMotion()` (or wrap in `Reveal`, which already does).
- Do not install new dependencies without a reason — this project already carries a large unused dependency surface from its Figma Make origin (§2, §16). The one exception so far (`unist-util-visit`, `acorn` for `remarkContentImages`) was justified specifically because both were already resolved transitively by the existing MDX toolchain — promoting an already-present transitive dependency to an explicit, pinned one is a very different call than adding a genuinely new package, and that distinction is worth preserving when evaluating future additions.
- Always run `npm run build` after structural/content-system changes (loader logic, MDX config, routing) — since there is no type-checking gate (§2, §15), the build succeeding is the primary signal that nothing is broken, and it must be paired with actually loading the affected route in a browser, since a successful bundle can still ship a runtime crash.
- When debugging a content item that "isn't showing up," check, in order: `status` spelling (tolerant now, but still must actually say "published"), whether it's excluded from `featured`-only sections like the homepage "Selected Work" (§5), and whether the directory name has a typo — before changing any component or loader code.
- Never silently change the content schema (`lib/content/types.ts`) without checking every current `.mdx` file's frontmatter against the new shape — there is no compiler enforcing this for you (§2, §15, §16).
- When modifying content infrastructure (loaders, `vite.config.ts`, `assets.ts`, `remarkContentImages.ts`), verify both `npm run dev` (HMR path, glob without `eager` timing surprises) and `npm run build` (the eager, fully-static path) — they are different code paths through Vite's plugin pipeline even though the source is identical. For anything touching MDX compilation specifically, verify with a disposable test fixture (a throwaway content directory) before trusting a clean build — a clean build only proves existing content wasn't broken, not that a new mechanism actually works, since existing content may not exercise the code path you just added.
