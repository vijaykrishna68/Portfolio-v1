import type { HTMLAttributes, RefObject } from "react";

type GlassNavProps = HTMLAttributes<HTMLElement> & {
  /**
   * true: clear glass (ground at 77%, 18px blur, 1px edge). Text colour adapts per
   * item to what is beneath (useAdaptiveNav). false: fully transparent.
   * Glass falls back to solid ground when backdrop-filter is unsupported or
   * prefers-reduced-transparency is set (see .glass-nav in theme.css).
   */
  glass?: boolean;
  /** Ref to the <nav>, for useAdaptiveNav. */
  navRef?: RefObject<HTMLElement | null>;
};

/**
 * Sticky navigation container (Earned Light 3). Glass appears here and on
 * tool-wall labels only. Safe-area insets are added for phones with notches
 * (they resolve to 0 unless the viewport meta uses viewport-fit=cover).
 */
export function GlassNav({ glass = true, navRef, className = "", children, ...rest }: GlassNavProps) {
  return (
    <nav
      ref={navRef as RefObject<HTMLElement>}
      className={`fixed inset-x-0 top-0 z-50 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] transition-[background-color,border-color] duration-300 ${
        glass ? "glass-nav" : "bg-transparent"
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </nav>
  );
}
