/** The 12 tool-wall glyphs in src/assets/glyphs/glyph-sprite.svg (ids are the <symbol> ids). */
export const GLYPHS = [
  { id: "A1-gear-train", code: "A1", name: "Gear train", use: "Systems, backend, architecture" },
  { id: "A2-dial", code: "A2", name: "Dial", use: "Performance, tuning, controls" },
  { id: "A3-terraces", code: "A3", name: "Terraces", use: "Data, growth, layered work" },
  { id: "A4-orbits", code: "A4", name: "Orbits", use: "Physics and quantum interest" },
  { id: "B1-keys", code: "B1", name: "Keys", use: "Frontend, input, keyboards" },
  { id: "B2-horizon", code: "B2", name: "Horizon", use: "Interfaces and layout" },
  { id: "B3-sampled-wave", code: "B3", name: "Sampled wave", use: "Signals, audio, hardware" },
  { id: "B4-chain", code: "B4", name: "Chain", use: "Blockchain and crypto" },
  { id: "C1-current-line", code: "C1", name: "Current line", use: "Electronics, circuits" },
  { id: "C2-superposition", code: "C2", name: "Superposition", use: "Quantum, research" },
  { id: "C3-desk-lamp", code: "C3", name: "Desk lamp", use: "Ideas, the earned light" },
  { id: "C4-calipers", code: "C4", name: "Calipers", use: "Precision, craft, measuring" },
] as const;

export type GlyphId = (typeof GLYPHS)[number]["id"];

/** Stroke width in the 200-unit viewBox so linework stays legible (README: 1.5 at 200px, 5 at 48px, 9 at 24px). */
export function glyphStrokeWidth(sizePx: number): number {
  if (sizePx >= 160) return 1.5;
  if (sizePx >= 96) return 3;
  if (sizePx >= 48) return 5;
  return 9;
}
