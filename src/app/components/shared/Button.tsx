import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { INTERACTION } from "../../lib/interaction";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "nav";
};

type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button(props: ButtonProps) {
  const { children, className = "", variant = "solid", ...rest } = props;
  const variants = {
    solid: `inline-flex items-center gap-2 px-7 py-3 bg-foreground text-background text-[13px] font-medium hover:bg-[#68b1f5] hover:text-white hover:shadow-[0_10px_24px_rgba(104,177,245,0.18)] ${INTERACTION.border} tracking-wide`,
    outline: `inline-flex items-center gap-2 px-7 py-3 border border-border text-foreground text-[13px] font-medium hover:bg-[#68b1f5] hover:text-white hover:border-[#68b1f5] hover:shadow-[0_10px_24px_rgba(104,177,245,0.14)] ${INTERACTION.border} tracking-wide`,
    nav: `inline-flex items-center gap-2 text-[13px] px-4 py-1.5 border border-border text-foreground hover:bg-[#68b1f5] hover:text-white hover:border-[#68b1f5] hover:shadow-[0_8px_18px_rgba(104,177,245,0.12)] ${INTERACTION.border}`,
  } as const;

  return (
    <button className={`${variants[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink(props: ButtonLinkProps) {
  const { children, className = "", variant = "solid", ...rest } = props;
  const variants = {
    solid: `inline-flex items-center gap-2 px-7 py-3 bg-foreground text-background text-[13px] font-medium hover:bg-[#68b1f5] hover:text-white hover:shadow-[0_10px_24px_rgba(104,177,245,0.18)] ${INTERACTION.border} tracking-wide`,
    outline: `inline-flex items-center gap-2 px-7 py-3 border border-border text-foreground text-[13px] font-medium hover:bg-[#68b1f5] hover:text-white hover:border-[#68b1f5] hover:shadow-[0_10px_24px_rgba(104,177,245,0.14)] ${INTERACTION.border} tracking-wide`,
    nav: `inline-flex items-center gap-2 text-[13px] px-4 py-1.5 border border-border text-foreground hover:bg-[#68b1f5] hover:text-white hover:border-[#68b1f5] hover:shadow-[0_8px_18px_rgba(104,177,245,0.12)] ${INTERACTION.border}`,
  } as const;

  return (
    <a className={`${variants[variant]} ${className}`.trim()} {...rest}>
      {children}
    </a>
  );
}