import type { HTMLAttributes } from "react";

type GlassNavProps = HTMLAttributes<HTMLElement> & {
  /**
   * true: smoky glass (slate 70% with 14px blur, bone hairline). Text inside is
   * always bone. false: fully transparent, normal ink colours.
   * Glass falls back to solid when backdrop-filter is unsupported or
   * prefers-reduced-transparency is set (see .glass-nav in theme.css).
   */
  glass?: boolean;
};

/**
 * Sticky navigation container (Earned Light 3). Glass appears here and on
 * tool-wall labels only. Safe-area insets are added for phones with notches
 * (they resolve to 0 unless the viewport meta uses viewport-fit=cover).
 */
export function GlassNav({ glass = true, className = "", children, ...rest }: GlassNavProps) {
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] transition-[background-color,border-color] duration-300 ${
        glass ? "glass-nav" : "bg-transparent"
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </nav>
  );
}
