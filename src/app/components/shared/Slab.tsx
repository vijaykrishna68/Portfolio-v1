import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { Label } from "./Label";

export type SlabVariant = "panel" | "stone" | "slab" | "accent";

type SlabProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** panel: quiet content. stone: quiet second slab. slab: the one dark block per composition. accent: one filled colour moment. */
  variant?: SlabVariant;
  /** Optional mono label shown at the top of the slab. */
  label?: ReactNode;
  /** Set false to drop the default 16px padding. */
  padded?: boolean;
};

const VARIANTS: Record<SlabVariant, { surface: string; labelTone: string }> = {
  panel: { surface: "bg-panel text-ink border-line", labelTone: "" },
  stone: { surface: "bg-stone text-ink border-line", labelTone: "" },
  slab: { surface: "bg-slab text-on-slab border-slab", labelTone: "!text-on-slab" },
  accent: { surface: "bg-accent text-on-accent border-accent", labelTone: "!text-on-accent" },
};

/**
 * Hard-edged block: 2px radius, 1.5px border, no shadow. The consumer provides
 * the content and the grid it sits on. Never put a second lit (gold) part in one.
 */
export function Slab({ as: Tag = "div", variant = "panel", label, padded = true, className = "", children, ...rest }: SlabProps) {
  const v = VARIANTS[variant];
  return (
    <Tag className={`border-stroke rounded-slab ${v.surface} ${padded ? "p-4" : ""} ${className}`.trim()} {...rest}>
      {label ? <Label className={`block mb-2 ${v.labelTone}`}>{label}</Label> : null}
      {children}
    </Tag>
  );
}
