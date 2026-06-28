/**
 * Primitive vocabulary shared across all content types.
 */
export type Tag = string;
export type Technology = string;
export type ContentStatus = "published" | "draft" | "archived";

/**
 * Discriminant union of every supported content type.
 * Add new types here as you add them to ContentItem below.
 */
export type ContentType =
  | "project"
  | "journal"
  | "playground"
  | "talk"
  | "conference-note"
  | "book-review"
  | "bookmark";

/**
 * Fields shared by every content item.
 * These map directly to what will live in MDX frontmatter later.
 */
export interface SharedFrontmatter {
  readonly type: ContentType;
  slug: string;
  title: string;
  description: string;
  status: ContentStatus;
  publishedAt: string;   // ISO 8601 — "2025-06-12"
  updatedAt?: string;
  tags: Tag[];
  cover?: string;
  coverAlt?: string;
}

// ─────────────────────────────────────────────────────────
// Active content types
// ─────────────────────────────────────────────────────────

export interface TechCategory {
  category: string;
  items: Technology[];
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  span?: "full" | "half";
}

/**
 * An engineering project entry.
 */
export interface Project extends SharedFrontmatter {
  readonly type: "project";
  year: string;                          // Display range — "2021 – 2022"
  challenge: string;
  technologies: Technology[];
  impact: string;
  cover: string;
  coverAlt: string;
  displayIndex: string;                  // "01", "02" — controls sort order display
  displayLayout: "default" | "flip";    // Whether the cover image sits left or right
  featured: boolean;
  hook?: string;                         // One-line tagline for the hero
  role?: string;                         // "Backend Engineer"
  techStack?: TechCategory[];            // Grouped tech for the stack section
  gallery?: GalleryImage[];              // Image grid with captions
  nextProject?: { slug: string; title: string };
  links?: {
    github?: string;
    live?: string;
    writeup?: string;
    caseStudy?: string;
  };
}

/**
 * A technical journal post.
 */
export interface JournalPost extends SharedFrontmatter {
  readonly type: "journal";
  excerpt: string;
  readTime: string;     // "8 min"
  featured: boolean;
  body?: string;
}

/**
 * A playground experiment or interactive demo.
 */
export interface PlaygroundItem extends SharedFrontmatter {
  readonly type: "playground";
  summary: string;
  cover: string;
  layout: {
    desktop: string;   // Tailwind CSS grid placement for desktop
    mobile: string;    // Tailwind CSS grid placement for mobile
  };
  demoUrl?: string;
  sourceUrl?: string;
  body?: string;
}

// ─────────────────────────────────────────────────────────
// Future content types — interfaces defined now so the
// architecture can accommodate them without changes to
// any existing type or component.
// ─────────────────────────────────────────────────────────

/**
 * A conference talk or guest lecture.
 */
export interface Talk extends SharedFrontmatter {
  readonly type: "talk";
  venue: string;
  eventDate: string;     // ISO 8601
  slidesUrl?: string;
  recordingUrl?: string;
  abstract?: string;
}

/**
 * Notes from attending a conference or talk.
 */
export interface ConferenceNote extends SharedFrontmatter {
  readonly type: "conference-note";
  conferenceName: string;
  eventDate: string;
  speaker?: string;
  body?: string;
}

/**
 * A book review with optional rating.
 */
export interface BookReview extends SharedFrontmatter {
  readonly type: "book-review";
  author: string;
  isbn?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  bookCover?: string;
  readAt?: string;      // ISO 8601
  body?: string;
}

/**
 * A saved link — from the web, GitHub, or other sources.
 */
export interface Bookmark extends SharedFrontmatter {
  readonly type: "bookmark";
  url: string;
  source?: "github" | "web" | "twitter" | "other";
  savedAt: string;      // ISO 8601
}

/**
 * Discriminated union of every content type.
 * Use this for generic content lists and type-safe switching.
 *
 * @example
 * function render(item: ContentItem) {
 *   switch (item.type) {
 *     case "project": return <ProjectCard project={item} />;
 *     case "journal": return <JournalCard post={item} />;
 *   }
 * }
 */
export type ContentItem =
  | Project
  | JournalPost
  | PlaygroundItem
  | Talk
  | ConferenceNote
  | BookReview
  | Bookmark;

/**
 * A content item paired with its compiled MDX component.
 * Returned by single-item lookups so detail pages can render the body.
 */
export type ContentWithMDX<T> = T & {
  Component: import("react").ComponentType<{
    components?: Record<string, import("react").ComponentType<any>>
  }>
}
