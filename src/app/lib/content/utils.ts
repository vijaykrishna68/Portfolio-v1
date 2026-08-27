export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Tolerant check for a "published" status — trims whitespace and ignores
 * case, so a stray space or wrong capitalization in frontmatter doesn't
 * silently hide content.
 */
export function isPublished(status: unknown): boolean {
  return typeof status === "string" && status.trim().toLowerCase() === "published";
}

/**
 * Strips a `slug` key out of a parsed frontmatter object, if present.
 *
 * The slug is always the content directory name — never the frontmatter —
 * so a stray `slug:` field in an MDX file can never silently redirect its
 * own URL.
 */
export function withoutFrontmatterSlug<T extends Record<string, unknown>>(
  frontmatter: T,
): Omit<T, "slug"> {
  const { slug: _slug, ...rest } = frontmatter;
  return rest;
}
