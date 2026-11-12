import type { ElementType, HTMLAttributes } from "react";

type LabelProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

/** Earned Light label: Martian Mono 500, 11px, uppercase, 0.1em tracking, ink-muted. */
export function Label({ as: Tag = "span", className = "", ...rest }: LabelProps) {
  return <Tag className={`type-label text-ink-muted ${className}`.trim()} {...rest} />;
}
