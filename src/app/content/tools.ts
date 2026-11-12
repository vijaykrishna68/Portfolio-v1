import type { GlyphId } from "../lib/glyphs";

/**
 * Tool wall data: each glyph stands for a kind of work, and lists the real
 * technologies in this repo that belong to it (project tags, the old Hero
 * cluster, and the "currently" status items). Site configuration, not
 * publishable content.
 */
export type ToolGroup = {
  glyph: GlyphId;
  technologies: string[];
};

export const TOOL_GROUPS: ToolGroup[] = [
  { glyph: "A1-gear-train", technologies: ["Node.js", "Express", "FastAPI", "Python", "Spring Boot (learning)", "Docker", "Render"] },
  { glyph: "A2-dial", technologies: ["Vite", "PostgreSQL internals (exploring)"] },
  { glyph: "A3-terraces", technologies: ["PostgreSQL", "MongoDB", "Mongoose", "TimescaleDB", "Supabase", "xlsx"] },
  { glyph: "B1-keys", technologies: ["React", "Next.js", "JavaScript", "qrcode.react"] },
  { glyph: "B2-horizon", technologies: ["Tailwind CSS", "Framer Motion", "Figma"] },
  { glyph: "B3-sampled-wave", technologies: ["Apache Kafka"] },
  { glyph: "C3-desk-lamp", technologies: ["Claude", "ChatGPT", "Notion"] },
  { glyph: "C4-calipers", technologies: ["TypeScript", "node:test", "Postman", "Git"] },
];

/** Glyphs with no technology behind them: interests only, no captions, no skill claims. */
export const CURIOUS_GLYPHS: GlyphId[] = ["A4-orbits", "B4-chain", "C1-current-line", "C2-superposition"];
