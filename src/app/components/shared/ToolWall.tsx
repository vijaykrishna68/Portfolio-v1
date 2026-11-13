import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
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

export type AutoLightState = {
  /** Fraction of the watched wall in view (0 to 1; counts as 0.6 when it fills 60% of the viewport height). */
  wall: number;
  /** Largest fraction of any [data-hero-composition] element in view. */
  hero: number;
  /** True once the automatic light has fired (or the user lit something first). */
  done: boolean;
};

const AUTO_LIGHT_WALL_MIN = 0.6; // wall at least 60% in view
const AUTO_LIGHT_HERO_MAX = 0.2; // Hero composition less than 20% in view

/**
 * Light one cell once, automatically: when the wall is at least 60% in view AND
 * no [data-hero-composition] is 20% or more in view, so the Hero sun and a lit
 * cell are never mostly on screen together. After that the light only moves on
 * hover, focus or tap and stays on the user's last choice. Nothing is lit at load.
 * Under reduced motion the fill has no animation (symbol .hi in theme.css).
 */
export function useAutoLight(glyph: GlyphId): AutoLightState & { wallRef: (el: HTMLElement | null) => void } {
  // Callback ref held in state: Reveal swaps its wrapper element when reduced motion is detected,
  // so the observer must follow whichever element is current.
  const [wallEl, setWallEl] = useState<HTMLElement | null>(null);
  const wall = useToolWall();
  const wallApi = useRef(wall);
  wallApi.current = wall;
  const done = useRef(false);
  const [state, setState] = useState<AutoLightState>({ wall: 0, hero: 0, done: false });

  useEffect(() => {
    const el = wallEl;
    if (!el) return;
    let wallRatio = 0;
    const heroRatios = new Map<Element, number>();

    const evaluate = () => {
      const hero = Math.max(0, ...heroRatios.values());
      const api = wallApi.current;
      if (!done.current && api) {
        if (api.litId !== null) done.current = true; // the user got there first
        else if (wallRatio >= AUTO_LIGHT_WALL_MIN && hero < AUTO_LIGHT_HERO_MAX) {
          done.current = true;
          api.light(glyph);
        }
      }
      setState({ wall: wallRatio, hero, done: done.current });
    };

    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const wallIO = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        const fillsViewport = e.intersectionRect.height >= AUTO_LIGHT_WALL_MIN * window.innerHeight;
        wallRatio = fillsViewport ? Math.max(e.intersectionRatio, AUTO_LIGHT_WALL_MIN) : e.intersectionRatio;
        evaluate();
      },
      { threshold: thresholds },
    );
    wallIO.observe(el);

    const heroIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) heroRatios.set(e.target, e.intersectionRatio);
        evaluate();
      },
      { threshold: thresholds },
    );
    document.querySelectorAll("[data-hero-composition]").forEach((h) => {
      heroRatios.set(h, 0);
      heroIO.observe(h);
    });

    return () => {
      wallIO.disconnect();
      heroIO.disconnect();
    };
  }, [wallEl, glyph]);

  return { ...state, wallRef: setWallEl };
}

/** The glyph sprite, inlined once. ToolWallProvider mounts it unless sprite={false}. */
export function GlyphSprite() {
  return <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden" dangerouslySetInnerHTML={{ __html: spriteMarkup }} />;
}

export function ToolWallProvider({
  defaultLit = null,
  sprite = true,
  children,
}: {
  defaultLit?: GlyphId | null;
  /** Set false when GlyphSprite is mounted elsewhere on the page. */
  sprite?: boolean;
  children: ReactNode;
}) {
  const [litId, setLitId] = useState<GlyphId | null>(defaultLit);
  const light = useCallback((id: GlyphId) => setLitId(id), []);
  const value = useMemo(() => ({ litId, light }), [litId, light]);
  return (
    <ToolWallContext.Provider value={value}>
      {sprite ? <GlyphSprite /> : null}
      {children}
    </ToolWallContext.Provider>
  );
}

/**
 * The pegboard: 1.5px line border, 2px radius, hairline dots every 24px. The
 * dots are an SVG pattern of circles (no CSS gradient), behind the cells.
 */
export function ToolWall({ columns = 3, className = "", children }: { columns?: 2 | 3 | 4; className?: string; children: ReactNode }) {
  const cols = columns === 4 ? "grid-cols-2 md:grid-cols-4" : columns === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2";
  const id = `wall-peg-${useId().replace(/:/g, "")}`;
  return (
    <div className={`relative grid ${cols} border-stroke border-line rounded-slab ${className}`.trim()}>
      <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.2" className="fill-hairline" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {children}
    </div>
  );
}
