import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </p>
  );
}