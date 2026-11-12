import type { CSSProperties } from "react";

import { useNoHover } from "../../hooks/useNoHover";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { GLYPHS, glyphStrokeWidth } from "../../lib/glyphs";
import type { GlyphId } from "../../lib/glyphs";
import { useToolWall } from "./ToolWall";

type ToolCellProps = {
  glyph: GlyphId;
  /** Defaults to "A1 · Gear train" built from the glyph id. */
  label?: string;
  /** Glyph size in px (default 96). Stroke width scales so lines stay legible. */
  size?: number;
  /** Controlled lit state. Ignored inside a ToolWallProvider, which owns it. */
  lit?: boolean;
  className?: string;
};

/**
 * One tool on the wall: glyph from the sprite, a glass mono label, and the one
 * lit gold part. Lit state comes from ToolWallProvider (one lit at a time).
 * Hover lifts the cell 8px (280ms, settle 360ms) only where hover exists and
 * motion is allowed; the gold fill takes 240ms (see symbol .hi in theme.css).
 */
export function ToolCell({ glyph, label, size = 96, lit: litProp = false, className = "" }: ToolCellProps) {
  const wall = useToolWall();
  const noHover = useNoHover();
  const reduced = usePrefersReducedMotion();

  const meta = GLYPHS.find((g) => g.id === glyph);
  const text = label ?? (meta ? `${meta.code} · ${meta.name}` : glyph);
  const lit = wall ? wall.litId === glyph : litProp;
  const canLift = !noHover && !reduced;

  const glyphStyle = {
    "--glyph-lit": lit ? "var(--lit)" : "var(--hairline)",
    "--glyph-bg": "var(--panel)",
    width: size,
    height: size,
    strokeWidth: glyphStrokeWidth(size),
  } as CSSProperties;

  return (
    <button
      type="button"
      aria-pressed={lit}
      onMouseEnter={wall && !noHover ? () => wall.light(glyph) : undefined}
      onFocus={wall ? () => wall.light(glyph) : undefined}
      onClick={wall ? () => wall.light(glyph) : undefined}
      className={`relative flex flex-col items-start gap-2 p-4 text-left text-ink border border-hairline ${
        reduced ? "" : "transition-transform duration-[360ms] ease-[cubic-bezier(.2,.8,.2,1)]"
      } ${canLift ? "hover:-translate-y-2 hover:duration-[280ms]" : ""} ${className}`.trim()}
    >
      <span className="glass-label type-label px-2 py-1 rounded-slab">{text}</span>
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        focusable="false"
        className="stroke-current"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={glyphStyle}
      >
        <use href={`#${glyph}`} />
      </svg>
    </button>
  );
}
