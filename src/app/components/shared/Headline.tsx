import { useEffect, useRef, useState } from "react";
import type { ElementType, HTMLAttributes } from "react";

import { useNoHover } from "../../hooks/useNoHover";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Width axis range for the hover relax: [at rest, on hover]. */
export type HeadlineHover = readonly [number, number];
/** Default for display headlines. */
export const HEADLINE_HOVER_DEFAULT: HeadlineHover = [75, 96];
/** For the name and short display lines only. */
export const HEADLINE_HOVER_NAME: HeadlineHover = [62, 84];

type HeadlineProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** [wdth at rest, wdth on hover]. Defaults to 75 -> 96; use HEADLINE_HOVER_NAME (62 -> 84) for the name and short lines. */
  hover?: HeadlineHover;
};

/**
 * Display headline (Anybody, uppercase, 800). On devices that can hover, and
 * only while the text sits on a single line, its width axis relaxes from
 * wdth 75 to 96 (62 to 84 for the name and short display lines) over 560ms. Multi-line headlines, touch devices and
 * prefers-reduced-motion never change width.
 *
 * Single-line check: the box is no taller than ~1.4 lines and the text, grown by
 * 50% (the widest hover state, measured at +41%), still fits the box, so hover can never wrap.
 * Keep headline sizes at 20px or more (token floor for display type).
 */
export function Headline({ as: Tag = "h2", hover = HEADLINE_HOVER_DEFAULT, className = "", children, style, ...rest }: HeadlineProps) {
  const ref = useRef<HTMLElement | null>(null);
  const noHover = useNoHover();
  const reduced = usePrefersReducedMotion();
  const [singleLine, setSingleLine] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // Never re-measure mid-hover: the wider hover state would flip the flag back.
      if (el.matches(":hover")) return;
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
      const oneLine = el.clientHeight <= lineHeight * 1.4;
      // Actual text width at rest (the element itself is usually block-level and full width).
      const range = document.createRange();
      range.selectNodeContents(el);
      const textWidth = range.getBoundingClientRect().width;
      // wdth 84 is up to ~41% wider than wdth 62 (measured), 1.5 gives margin: only enable if that still fits on one line.
      const roomToGrow = textWidth * 1.5 <= el.clientWidth;
      setSingleLine(oneLine && roomToGrow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement ?? el);
    return () => ro.disconnect();
  }, [children]);

  const active = singleLine && !noHover && !reduced;

  return (
    <Tag
      ref={ref}
      data-single-line={active ? "true" : "false"}
      style={{ ["--hw-from" as string]: hover[0], ["--hw-to" as string]: hover[1], ...style }}
      className={`font-display headline-hover ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
