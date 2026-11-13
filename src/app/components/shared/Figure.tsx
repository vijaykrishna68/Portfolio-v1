import type { ReactNode } from "react";

import { Label } from "./Label";
import { Slab } from "./Slab";
import type { SlabVariant } from "./Slab";

type FigureProps = {
  /** The digits, e.g. "840" or "40". Doto is for digits and units only. */
  value: string;
  /** Optional unit set beside the digits, e.g. "ms" or "%". */
  unit?: string;
  /** Mono label under the number, e.g. "ms before". */
  label: ReactNode;
  /** One factual sentence that says what changed. */
  caption: ReactNode;
  /** Digit size in px, 40 to 92 (default 64). */
  size?: number;
  /** Surface the metric sits on (default panel; use stone inside a panel card). */
  variant?: SlabVariant;
  className?: string;
};

/** A real before/after metric: Doto 900 digits, mono label, one factual sentence. */
export function Figure({ value, unit, label, caption, size = 64, variant = "panel", className = "" }: FigureProps) {
  const px = Math.min(92, Math.max(40, size));
  return (
    <Slab variant={variant} className={className}>
      <div className="font-figure font-black text-ink leading-none" style={{ fontSize: px }}>
        <span>{value}</span>
        {unit ? <span className="ml-1">{unit}</span> : null}
      </div>
      <Label className="block mt-3">{label}</Label>
      <p className="mt-3 text-ink-muted">{caption}</p>
    </Slab>
  );
}
