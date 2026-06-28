# Content Guide

How to add and manage content on this portfolio.

Content lives in the `content/` directory. Each piece of content is a folder containing an `index.mdx` file. Adding a new folder creates a new page automatically on the next build.

---

## Projects

### Add a new project

```bash
mkdir content/projects/your-project-slug
cp content/templates/project-template.mdx content/projects/your-project-slug/index.mdx
```

Edit `index.mdx`. Set `status: published` when ready.

### Required frontmatter

```yaml
---
type: project
title: "Project Title"
description: "One to two sentences. Used in cards and meta description."
status: published          # or: draft, archived
publishedAt: "2025-06-01"  # ISO 8601
tags: ["Go", "PostgreSQL"]
year: "2024 – 2025"        # Display string
challenge: "The core engineering problem you solved."
technologies: ["Go", "PostgreSQL", "Redis"]
impact: "The measurable outcome."
cover: "./cover.jpg"       # or absolute Unsplash URL
coverAlt: "Description of the image"
displayIndex: "04"         # Controls sort order: "01", "02", ...
displayLayout: "default"   # or "flip" — which side the image sits on
featured: false
---
```

### Optional frontmatter

```yaml
role: "Backend Engineer"    # Your role on this project
hook: "One punchy line summarising the project."
```

### Body

Write the project in plain Markdown after the frontmatter. Use `##` for sections.
Suggested sections: Problem, Architecture, Technical Decisions, Lessons Learned.

### Images

**Cover image:** reference `./cover.jpg` in frontmatter, place the file next to `index.mdx`.

**Inline images:** `![alt text](./image.jpg)` anywhere in the body.

**External images:** Unsplash URLs work fine — `https://images.unsplash.com/photo-xxx`.

### MDX caution

Avoid bare `<` followed by a number in body text — MDX parses it as JSX.
Write `under 50` instead of `<50`, or use `&lt;50`.

---

## Journal

### Add a new post

```bash
mkdir content/journal/your-post-slug
cp content/templates/journal-template.mdx content/journal/your-post-slug/index.mdx
```

### Required frontmatter

```yaml
---
type: journal
title: "Post Title"
description: "One sentence summary. Used in meta."
excerpt: "One sentence shown in cards. Can be same as description."
status: published
publishedAt: "2025-06-01"
tags: ["Backend"]
readTime: "8 min"     # Set manually — estimate 200 words/min
featured: false       # Only one post should be featured: true
---
```

### Featured post

One post should have `featured: true`. It appears in the large card on the home page.
If multiple posts are marked featured, the first one (newest) is used.

---

## Playground

### Add a new item

```bash
mkdir content/playground/your-item-slug
cp content/templates/playground-template.mdx content/playground/your-item-slug/index.mdx
```

### Required frontmatter

```yaml
---
type: playground
title: "Experiment Title"
description: "One sentence."
summary: "Same as description, or shorter for card display."
status: published
publishedAt: "2025-06-01"
tags: ["Visualization"]
cover: "./preview.jpg"    # or Unsplash URL
layout:
  desktop: "col-start-1 col-span-2 row-start-1 row-span-2"
  mobile: "col-span-2 row-span-2"
---
```

### Grid layout

The home page playground grid is 4 columns × 2 rows. Each item has a `layout.desktop` and `layout.mobile` Tailwind grid placement class.

Current layout uses all 4 columns × 2 rows. If you add a fifth item, adjust all items' `layout` fields so the grid still fills correctly.

### Optional frontmatter

```yaml
demoUrl: "https://your-demo.com"
sourceUrl: "https://github.com/you/repo"
```

---

## Drafts

Set `status: draft` to keep content out of the published site while you work on it.
Draft content is never shown to visitors.

Place work-in-progress MDX files in `content/drafts/` if you prefer to keep them completely separate from the published directories.

---

## Slugs

The slug is the **folder name**, not anything in the frontmatter. Choose slugs carefully — they become permanent URLs.

- Use lowercase letters, numbers, and hyphens
- No spaces or special characters
- Examples: `b-trees-from-first-principles`, `multi-tenant-api-gateway`

---

## Deployment checklist after adding content

- [ ] Update `public/sitemap.xml` with the new URL
- [ ] Verify `status: published` is set
- [ ] Check cover image path is correct
- [ ] Preview locally with `npm run dev`
- [ ] Push to `main` to deploy
