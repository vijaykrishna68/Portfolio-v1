import type { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-[1320px] mx-auto px-6 md:px-10">{children}</div>;
}