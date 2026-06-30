import type { ComponentType } from "react";
import type { JournalPost, ContentWithMDX } from "./types";
import { resolveAsset } from "./assets";

type MDXModule = {
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  frontmatter: Record<string, unknown>;
};

const modules = import.meta.glob<MDXModule>("/content/journal/*/index.mdx", {
  eager: true,
});

function loadAll(): ContentWithMDX<JournalPost>[] {
  return Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/")[3];
    const dir = path.substring(0, path.lastIndexOf("/"));

    const item = {
      slug,
      ...(mod.frontmatter as Omit<JournalPost, "slug">),
      Component: mod.default,
    } as ContentWithMDX<JournalPost>;

    if (item.cover) item.cover = resolveAsset(item.cover, dir);

    return item;
  });
}

/** All published journal posts, sorted newest-first. */
export function getJournalPosts(): JournalPost[] {
  return loadAll()
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/** Look up a single post by slug, paired with its MDX component. */
export function getJournalPost(
  slug: string,
): ContentWithMDX<JournalPost> | undefined {
  return loadAll().find((p) => p.slug === slug && p.status === "published");
}

/** The single post marked as featured. */
export function getFeaturedJournalPost(): JournalPost | undefined {
  return loadAll().find((p) => p.featured && p.status === "published");
}
