/**
 * Hero right column: the brand-sheet cover composition.
 * One filled accent slab carrying the VK mark in on-accent, one small filled
 * tension block (no text) offset down the diagonal, and the single lit corner
 * sun. Hard 2px edges (radius-slab), flat fills, no gradients, no shadows.
 * Verdigris and rust are fills only here, never text. The dot grid is an SVG
 * pattern of circles at the 24px pitch (space-6), not a CSS gradient.
 */
const R = 2; // --radius-slab

export function HeroComposition({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[480px] aspect-square overflow-hidden ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full" focusable="false">
        <defs>
          <pattern id="hero-peg" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.4" className="fill-hairline" />
          </pattern>
        </defs>

        <rect width="480" height="480" fill="url(#hero-peg)" />

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

        {/* The single lit corner sun */}
        <circle cx="480" cy="480" r="64" className="fill-lit" />
      </svg>
    </div>
  );
}
