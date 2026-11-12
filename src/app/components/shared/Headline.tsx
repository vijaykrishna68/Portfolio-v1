import { useEffect, useRef, useState } from "react";
import type { ElementType, HTMLAttributes } from "react";

import { useNoHover } from "../../hooks/useNoHover";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type HeadlineProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

/**
 * Display headline (Anybody, uppercase, 800). On devices that can hover, and
 * only while the text sits on a single line, its width axis relaxes from
 * wdth 62 to 84 over 560ms. Multi-line headlines, touch devices and
 * prefers-reduced-motion never change width.
 *
 * Single-line check: the box is no taller than ~1.4 lines and its text takes at
 * most 85% of the parent width, so the wider hover state cannot wrap.
 * Keep headline sizes at 20px or more (token floor for display type).
 */
export function Headline({ as: Tag = "h2", className = "", children, ...rest }: HeadlineProps) {
  const ref = useRef<HTMLElement | null>(null);
  const noHover = useNoHover();
  const reduced = usePrefersReducedMotion();
  const [singleLine, setSingleLine] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
      const parentWidth = el.parentElement?.clientWidth ?? el.clientWidth;
      const oneLine = el.clientHeight <= lineHeight * 1.4;
      const roomToGrow = el.scrollWidth <= parentWidth * 0.85;
      setSingleLine(oneLine && roomToGrow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [children]);

  const active = singleLine && !noHover && !reduced;

  return (
    <Tag
      ref={ref}
      data-single-line={active ? "true" : "false"}
      className={`font-display headline-hover ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
