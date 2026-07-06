import { useEffect, useRef, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in milliseconds. Default 0. */
  delay?: number;
  /** Forwarded to the wrapper <div>. Use for grid/flex placement classes. */
  className?: string;
};

/**
 * Wraps children in a fade + slide-up entrance animation that triggers once
 * when the element enters the viewport.
 *
 * Respects prefers-reduced-motion — renders children unstyled when set.
 * The `className` prop is forwarded to the wrapper div so grid/flex placement
 * classes remain on the correct DOM node.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  // Reduced-motion: skip animation entirely. Still apply className if given
  // so grid/flex layout is preserved.
  if (reduced) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(16px)",
        transition: `opacity 300ms ease-out ${delay}ms, transform 300ms ease-out ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
