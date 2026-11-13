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
  /** The cell that is lit right now (null while suppressed or before anything is chosen). */
  litId: GlyphId | null;
  /** The last cell chosen (automatically or by the user), even while the light is suppressed. */
  chosenId: GlyphId | null;
  /** True while the light is switched off so it cannot share the screen with the Hero sun. */
  suppressed: boolean;
  light: (id: GlyphId) => void;
  setSuppressed: (v: boolean) => void;
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
  /** True while the light is faded out because the Hero sun is on screen. */
  suppressed: boolean;
};

const AUTO_LIGHT_WALL_MIN = 0.6; // wall at least 60% in view
const AUTO_LIGHT_HERO_MAX = 0.2; // relight when the Hero composition is under 20% in view (and its sun is off screen)
const AUTO_LIGHT_HERO_HIDE = 0.5; // fade the light out when the Hero composition is over 50% in view

/**
 * Keeps one gold part on screen at a time.
 *  - Nothing is lit at load. A1 lights once, when the wall is at least 60% in
 *    view and the Hero composition is under 20% in view.
 *  - When a [data-hero-composition] is over 50% in view, or its sun
 *    ([data-hero-sun]) is visible at all, the lit cell fades out (240ms, none
 *    under reduced motion; symbol .hi in theme.css). The last-chosen cell
 *    relights once the Hero is under 20% in view and its sun is off screen.
 *  - Otherwise the light only moves on hover, focus or tap.
 * The sun guard goes beyond the 50% threshold on purpose: scrolling up, the sun
 * (bottom of the composition) appears long before the composition is 20% visible.
 */
export function useAutoLight(glyph: GlyphId): AutoLightState & { wallRef: (el: HTMLElement | null) => void } {
  // Callback ref held in state: Reveal swaps its wrapper element when reduced motion is detected,
  // so the observer must follow whichever element is current.
  const [wallEl, setWallEl] = useState<HTMLElement | null>(null);
  const wall = useToolWall();
  const wallApi = useRef(wall);
  wallApi.current = wall;
  const done = useRef(false);
  const [state, setState] = useState<AutoLightState>({ wall: 0, hero: 0, done: false, suppressed: false });

  useEffect(() => {
    const el = wallEl;
    if (!el) return;
    let wallRatio = 0;
    const heroRatios = new Map<Element, number>();
    const sunSeen = new Set<Element>();

    const evaluate = () => {
      const hero = Math.max(0, ...heroRatios.values());
      const sun = sunSeen.size > 0;
      const api = wallApi.current;
      if (api) {
        if (hero > AUTO_LIGHT_HERO_HIDE || sun) {
          api.setSuppressed(true);
        } else if (hero < AUTO_LIGHT_HERO_MAX) {
          api.setSuppressed(false);
          if (!done.current) {
            if (api.chosenId !== null) done.current = true; // the user got there first
            else if (wallRatio >= AUTO_LIGHT_WALL_MIN) {
              done.current = true;
              api.light(glyph);
            }
          }
        }
      }
      setState({ wall: wallRatio, hero, done: done.current, suppressed: api?.suppressed ?? false });
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

    const sunIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? sunSeen.add(e.target) : sunSeen.delete(e.target));
        evaluate();
      },
      // 80px margin: the light is already off before the first sliver of sun can show.
      { threshold: [0], rootMargin: "80px 0px 80px 0px" },
    );
    document.querySelectorAll("[data-hero-sun]").forEach((s) => sunIO.observe(s));

    return () => {
      wallIO.disconnect();
      heroIO.disconnect();
      sunIO.disconnect();
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
  const [chosenId, setChosenId] = useState<GlyphId | null>(defaultLit);
  const [suppressed, setSuppressed] = useState(false);
  const light = useCallback((id: GlyphId) => setChosenId(id), []);
  const litId = suppressed ? null : chosenId;
  const value = useMemo(() => ({ litId, chosenId, suppressed, light, setSuppressed }), [litId, chosenId, suppressed, light]);
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
