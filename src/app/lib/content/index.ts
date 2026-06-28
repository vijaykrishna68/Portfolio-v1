/**
 * Public content API.
 *
 * This is the only import path that UI components should ever use:
 *
 *   import { getProjects, getJournalPosts } from "../../lib/content";
 *
 * The underlying implementation (mock TS, MDX, CMS, API) is irrelevant
 * to the caller and can be swapped without touching any component.
 */

// Types — available for prop typing in components
export type {
  ContentType,
  ContentStatus,
  ContentItem,
  ContentWithMDX,
  SharedFrontmatter,
  Tag,
  Technology,
  TechCategory,
  GalleryImage,
  Project,
  JournalPost,
  PlaygroundItem,
  Talk,
  ConferenceNote,
  BookReview,
  Bookmark,
} from "./types";

// Utilities
export { formatDate } from "./utils";

// Content API functions
export { getProjects, getProjectBySlug, getFeaturedProjects } from "./projects";
export { getJournalPosts, getJournalPost, getFeaturedJournalPost } from "./journal";
export { getPlaygroundItems, getPlaygroundItem } from "./playground";
