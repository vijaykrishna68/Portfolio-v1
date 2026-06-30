import type { ComponentType } from "react";
import type { PlaygroundItem, ContentWithMDX } from "./types";
import { resolveAsset } from "./assets";

type MDXModule = {
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  frontmatter: Record<string, unknown>;
};

const modules = import.meta.glob<MDXModule>(
  "/content/playground/*/index.mdx",
  { eager: true },
);

function loadAll(): ContentWithMDX<PlaygroundItem>[] {
  return Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/")[3];
    const dir = path.substring(0, path.lastIndexOf("/"));

    const item = {
      slug,
      ...(mod.frontmatter as Omit<PlaygroundItem, "slug">),
      Component: mod.default,
    } as ContentWithMDX<PlaygroundItem>;

    if (item.cover) item.cover = resolveAsset(item.cover, dir);

    return item;
  });
}

/** All published playground items. */
export function getPlaygroundItems(): PlaygroundItem[] {
  return loadAll().filter((item) => item.status === "published");
}

/** Look up a single item by slug, paired with its MDX component. */
export function getPlaygroundItem(
  slug: string,
): ContentWithMDX<PlaygroundItem> | undefined {
  return loadAll().find(
    (item) => item.slug === slug && item.status === "published",
  );
}
