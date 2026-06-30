// Vite bundles every image under /content/ and records its final hashed URL here.
// Keys:   absolute-from-root path as Vite sees it — "/content/projects/my-slug/cover.png"
// Values: hashed output URL Vite assigns at build time — "/assets/cover-Bxyz1234.png"
//
// The `query: '?url'` option is what triggers bundling. Without it Vite would
// not process these files and the paths would remain unresolved at runtime.
const contentImages = import.meta.glob<string>(
  "/content/**/*.{png,jpg,jpeg,gif,webp,svg,avif}",
  { eager: true, query: "?url", import: "default" },
);

/**
 * Resolves a frontmatter image path into a Vite-bundled asset URL.
 *
 * Only relative paths are resolved (those starting with "./").
 * Absolute URLs (https://...) and empty strings are returned unchanged.
 *
 * @param rawPath    - The raw string from frontmatter, e.g. "./cover.png"
 * @param contentDir - The directory of the MDX file, e.g. "/content/projects/my-slug"
 */
export function resolveAsset(rawPath: string, contentDir: string): string {
  if (!rawPath || !rawPath.startsWith(".")) return rawPath;
  const key = contentDir + "/" + rawPath.replace(/^\.\//, "");
  return contentImages[key] ?? rawPath;
}
