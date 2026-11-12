import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import spriteMarkup from "../../../assets/glyphs/glyph-sprite.svg?raw";
import type { GlyphId } from "../../lib/glyphs";

/**
 * Tool-wall state: exactly one cell is lit at a time. Hovering, focusing or
 * tapping another cell moves the light; the previous cell goes back on the wall.
 * The provider also inlines the glyph sprite once, so cells can reference
 * <use href="#A1-gear-train" />. Mount one provider per page (the sprite ids
 * must be unique in the document).
 */
type ToolWallContextValue = {
  litId: GlyphId | null;
  light: (id: GlyphId) => void;
};

const ToolWallContext = createContext<ToolWallContextValue | null>(null);

export function useToolWall() {
  return useContext(ToolWallContext);
}

export function ToolWallProvider({ defaultLit = null, children }: { defaultLit?: GlyphId | null; children: ReactNode }) {
  const [litId, setLitId] = useState<GlyphId | null>(defaultLit);
  const light = useCallback((id: GlyphId) => setLitId(id), []);
  const value = useMemo(() => ({ litId, light }), [litId, light]);
  return (
    <ToolWallContext.Provider value={value}>
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden" dangerouslySetInnerHTML={{ __html: spriteMarkup }} />
      {children}
    </ToolWallContext.Provider>
  );
}

/** The pegboard: 1.5px line border, 2px radius, hairline dots every 24px. */
export function ToolWall({ columns = 3, className = "", children }: { columns?: 2 | 3 | 4; className?: string; children: ReactNode }) {
  const cols = columns === 4 ? "grid-cols-2 md:grid-cols-4" : columns === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2";
  return <div className={`pegboard grid ${cols} border-stroke border-line rounded-slab ${className}`.trim()}>{children}</div>;
}
