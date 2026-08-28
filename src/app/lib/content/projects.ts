import type { ComponentType } from "react";
import type { Project, ContentWithMDX } from "./types";
import { resolveAsset } from "./assets";
import { isPublished, withoutFrontmatterSlug } from "./utils";

type MDXModule = {
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  frontmatter: Record<string, unknown>;
};

const modules = import.meta.glob<MDXModule>("/content/projects/*/index.mdx", {
  eager: true,
});

function loadAll(): ContentWithMDX<Project>[] {
  return Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/")[3];
    const dir = path.substring(0, path.lastIndexOf("/"));

    const item = {
      slug,
      ...(withoutFrontmatterSlug(mod.frontmatter) as Omit<Project, "slug">),
      Component: mod.default,
    } as ContentWithMDX<Project>;

    if (item.cover) item.cover = resolveAsset(item.cover, dir);

    return item;
  });
}

/** All published projects in display order. */
export function getProjects(): Project[] {
  return loadAll()
    .filter((p) => isPublished(p.status))
    .sort((a, b) => a.displayIndex.localeCompare(b.displayIndex));
}

/** Look up a single project by slug, paired with its MDX component. */
export function getProjectBySlug(
  slug: string,
): ContentWithMDX<Project> | undefined {
  return loadAll().find((p) => p.slug === slug && isPublished(p.status));
}

/**
 * Projects marked as featured, ordered for the homepage "Selected Work"
 * section specifically. Sorted by featuredIndex (falling back to
 * displayIndex when unset) — a separate key from displayIndex so choosing
 * Selected Work's dominant project never reorders /projects.
 */
export function getFeaturedProjects(): Project[] {
  return getProjects()
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredIndex ?? a.displayIndex).localeCompare(b.featuredIndex ?? b.displayIndex));
}
