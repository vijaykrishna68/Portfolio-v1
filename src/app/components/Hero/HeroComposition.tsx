import { useEffect, useId, useRef, useState } from "react";

/**
 * Hero right column: the brand-sheet cover composition inside a frame.
 * Frame: 1.5px `line` border, 2px radius, clips everything inside it. Inside:
 * a dot grid (1.75px circles, 24px pitch, ink-muted at 28%, 42% in dark where 28% vanishes), one filled accent
 * slab carrying the VK mark in on-accent, one small filled tension block (no
 * text) offset down the diagonal, and the single lit sun, cut by the frame's
 * bottom-right corner. Flat fills, no gradients, no shadows. Verdigris and rust
 * are fills only, never text.
 */
const R = 2; // --radius-slab
const VIEW = 480;
const DOT_DIAMETER = 1.75; // px, kept constant at any rendered size

export function HeroComposition({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Rendered twice (mobile and desktop slots): each needs its own pattern id.
  const patternId = `hero-peg-${useId().replace(/:/g, "")}`;
  const [scale, setScale] = useState(1); // rendered px per viewBox unit

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / VIEW || 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Shapes scale with the frame, so the 24px grid is drawn in viewBox units and
  // the dot radius is divided by the scale to stay 1.75px on screen.
  const dotR = DOT_DIAMETER / 2 / scale;

  return (
    <div
      ref={ref}
      data-hero-composition
      className={`relative w-full max-w-[480px] aspect-square overflow-hidden border-stroke border-line rounded-slab ${className}`.trim()}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          <pattern id={patternId} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r={dotR} className="fill-ink-muted/28 dark:fill-ink-muted/42" />
          </pattern>
        </defs>

        {/* Dot grid fills the whole frame */}
        <rect width={VIEW} height={VIEW} fill={`url(#${patternId})`} />

        {/* The one accent slab, carrying the mark */}
        <rect x="72" y="48" width="264" height="288" rx={R} className="fill-accent" />
        <text
          x="96"
          y="312"
          className="fill-on-accent font-display"
          style={{ fontSize: 208, fontWeight: 900, letterSpacing: "-0.01em", ["--display-wdth" as string]: 62 }}
        >
          VK
        </text>

        {/* Small tension block, no text, offset along the diagonal */}
        <rect x="312" y="312" width="96" height="96" rx={R} className="fill-tension" />

        {/* The single lit sun, cut by the frame's bottom-right corner */}
        <circle cx={VIEW} cy={VIEW} r="64" className="fill-lit" />
      </svg>
    </div>
  );
}
