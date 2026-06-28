import type { HTMLAttributes, ReactNode } from "react";

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Tag({ children, className = "", style, ...props }: TagProps) {
  return (
    <span {...props} className={className} style={style}>
      {children}
    </span>
  );
}