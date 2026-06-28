# Vijay Krishna – Portfolio

Personal portfolio and engineering journal. Built with Vite, React 18, Tailwind CSS 4, and MDX.

## Tech stack

- **Vite 6** + **React 18** — SPA, no SSR
- **Tailwind CSS 4** — utility-first styling
- **react-router 7** — client-side routing (Library Mode)
- **MDX** — content authoring (`@mdx-js/rollup`)
- **TypeScript** throughout

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
```

## Adding content

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for the complete guide.

Quick reference:

```bash
# New project
mkdir content/projects/your-project-slug
cp content/templates/project-template.mdx content/projects/your-project-slug/index.mdx

# New journal post
mkdir content/journal/your-post-slug
cp content/templates/journal-template.mdx content/journal/your-post-slug/index.mdx

# New playground item
mkdir content/playground/your-item-slug
cp content/templates/playground-template.mdx content/playground/your-item-slug/index.mdx
```

Edit the MDX file. Set `status: published`. Restart dev server or it auto-reloads.

## Deployment

Deploys to Vercel. `vercel.json` is already configured for SPA routing.

Push to `main` → Vercel builds and deploys automatically.

**Before deploying:**
1. Update `CONTACT_EMAIL` in `src/app/content/site.ts`
2. Update social links in `src/app/content/site.ts`
3. Replace placeholder URLs in `index.html`, `public/robots.txt`, `public/sitemap.xml` with your actual domain
4. Update `public/sitemap.xml` when you add new content

## Project structure

```
content/               ← MDX content files (add your posts here)
  projects/
  journal/
  playground/
  templates/           ← copy these when creating new content

src/app/
  components/          ← UI components (do not redesign)
  hooks/               ← custom React hooks
  lib/content/         ← content API (getProjects, getJournalPosts, etc.)
  pages/               ← route page components
  content/             ← site config and timeline data

public/                ← static assets (favicon, robots.txt, sitemap)
```
