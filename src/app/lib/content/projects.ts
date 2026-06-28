import type { ComponentType } from "react";
import type { Project, ContentWithMDX } from "./types";

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
    return {
      slug,
      ...(mod.frontmatter as Omit<Project, "slug">),
      Component: mod.default,
    } as ContentWithMDX<Project>;
  });
}

/** All published projects in display order. */
export function getProjects(): Project[] {
  return loadAll()
    .filter((p) => p.status === "published")
    .sort((a, b) => a.displayIndex.localeCompare(b.displayIndex));
}

/** Look up a single project by slug, paired with its MDX component. */
export function getProjectBySlug(
  slug: string,
): ContentWithMDX<Project> | undefined {
  return loadAll().find((p) => p.slug === slug && p.status === "published");
}

/** Projects marked as featured, in display order. */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}
