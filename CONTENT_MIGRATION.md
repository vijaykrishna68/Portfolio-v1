# Content Layer Migration Guide

This document explains the current content architecture, where MDX plugs in, and the exact steps to complete the migration when you are ready.

---

## How the architecture works today

```
content/projects/*.ts (mock data)
         │
         ▼
src/app/lib/content/projects.ts   ← getProjects(), getProjectBySlug(), getFeaturedProjects()
src/app/lib/content/journal.ts    ← getJournalPosts(), getJournalPost(), getFeaturedJournalPost()
src/app/lib/content/playground.ts ← getPlaygroundItems(), getPlaygroundItem()
         │
         ▼
src/app/lib/content/index.ts      ← single barrel export
         │
         ▼
SelectedWork.tsx, Journal.tsx, Playground.tsx  ← import from ../../lib/content
         │
         ▼
ProjectCard.tsx, JournalCard.tsx, PlaygroundCard.tsx  ← receive typed props
```

The UI calls functions. It never touches data files. The functions currently return mock TypeScript objects. When MDX arrives, only the function bodies change. Nothing else.

---

## Phase 2: MDX Migration

### What you need to install

```bash
pnpm add gray-matter          # frontmatter parser
pnpm add reading-time          # auto read-time from MDX body
# If you want rich MDX components later:
pnpm add @mdx-js/mdx           # MDX compiler
pnpm add remark-gfm            # GitHub-flavored markdown
```

### The directory contract

Each piece of content lives in its own directory:

```
content/projects/your-project-slug/
  index.mdx        ← frontmatter + body
  cover.png        ← referenced as "./cover.png" in frontmatter
  architecture.png ← supplemental images
  gallery/         ← optional gallery images
    01.png
    02.png
```

The slug is the directory name. No need to define it explicitly in frontmatter — the parser derives it from the path.

### How to replace the mock implementation

Open `src/app/lib/content/projects.ts`. The function signatures stay identical. Only the internals change:

```typescript
// BEFORE (current mock implementation)
import type { Project } from "./types";

const MOCK_PROJECTS: Project[] = [ /* ... */ ];

export function getProjects(): Project[] {
  return MOCK_PROJECTS.filter((p) => p.status === "published");
}
```

```typescript
// AFTER (MDX implementation — example using Node.js fs + gray-matter)
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import type { Project } from "./types";

const CONTENT_DIR = join(process.cwd(), "content/projects");

function loadProject(slug: string): Project {
  const file = readFileSync(join(CONTENT_DIR, slug, "index.mdx"), "utf-8");
  const { data } = matter(file);
  return {
    type: "project",
    slug,
    ...data,
  } as Project;
}

function loadAllProjects(): Project[] {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => loadProject(d.name));
}

export function getProjects(): Project[] {
  return loadAllProjects()
    .filter((p) => p.status === "published")
    .sort((a, b) => a.displayIndex.localeCompare(b.displayIndex));
}

export function getProjectBySlug(slug: string): Project | undefined {
  try {
    return loadProject(slug);
  } catch {
    return undefined;
  }
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}
```

Apply the same swap to `journal.ts` and `playground.ts`.

**That is the entire migration. No component changes. No type changes. No UI changes.**

### Adding a new project after migration

```bash
mkdir content/projects/vector-scheduler
cp content/templates/project-template.mdx content/projects/vector-scheduler/index.mdx
# Edit index.mdx, add cover.png, done
```

The project appears in the UI automatically on next build/reload.

---

## Phase 3: Routing (future, optional)

When you want individual project pages at `/projects/vector-scheduler`:

1. Add React Router routes (already installed: `react-router` 7.13.0)
2. Create `src/app/pages/ProjectPage.tsx` that calls `getProjectBySlug(slug)`
3. Render `project.body` (compiled MDX HTML) inside the page layout

The content API already exposes `getProjectBySlug()`. The page just calls it.

---

## Adding new content types

To add a type like `Talk` that was scaffolded in `types.ts` but has no implementation yet:

1. Create `content/talks/your-talk-slug/index.mdx` using the pattern above
2. Create `src/app/lib/content/talks.ts` with `getTalks()` and `getTalkBySlug()`
3. Export from `src/app/lib/content/index.ts`
4. Add `content/templates/talk-template.mdx`

No changes to any existing component or type.

---

## Source-agnostic future

The function signatures in `lib/content/` are the stable contract. The implementation behind them can be anything:

| Source | What changes |
|---|---|
| TypeScript mock objects | Nothing — current state |
| MDX files | Function bodies in `lib/content/*.ts` |
| Headless CMS (Sanity, Contentful) | Function bodies — fetch from API instead of file system |
| Local JSON files | Function bodies — `JSON.parse(readFileSync(...))` |
| REST API | Function bodies — `await fetch(...)` |

The UI never knows. The types never change. The function signatures never change.
