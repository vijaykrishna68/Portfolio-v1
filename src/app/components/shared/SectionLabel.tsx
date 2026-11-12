import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-label uppercase tracking-[0.22em] text-muted-foreground font-mono"
    >
      {children}
    </p>
  );
}