import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Earned Light buttons.
 *  solid   primary: slab fill, on-slab text
 *  outline secondary: transparent, 1.5px line border
 *  nav     compact secondary for the nav bar
 *  lit     the single main call to action in a view (lit fill). It counts as
 *          the view's one lit part, so do not light anything else beside it.
 * Label: Martian Mono 500, 12px, uppercase, 0.1em. Hover lifts 4px over 280ms
 * (hover-capable devices only; disabled under prefers-reduced-motion). The
 * focus ring is the global 3px accent ring.
 */
export type ButtonVariant = "solid" | "outline" | "nav" | "lit";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

const BASE =
  "inline-flex items-center justify-center gap-2 border-stroke rounded-slab font-mono font-medium text-[12px] leading-none uppercase tracking-[0.1em] " +
  "transition-[transform,background-color,color,border-color] duration-[280ms] ease-[cubic-bezier(.2,.8,.2,1)] " +
  "hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const VARIANTS: Record<ButtonVariant, string> = {
  solid: "px-5 py-3.5 bg-slab text-on-slab border-slab",
  outline: "px-5 py-3.5 bg-transparent text-ink border-line",
  nav: "px-4 py-2 bg-transparent text-ink border-line",
  lit: "px-5 py-3.5 bg-lit text-on-lit border-on-lit",
};

function classes(variant: ButtonVariant, className: string) {
  return `${BASE} ${VARIANTS[variant]} ${className}`.trim();
}

export function Button(props: ButtonProps) {
  const { children, className = "", variant = "solid", ...rest } = props;
  return (
    <button className={classes(variant, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink(props: ButtonLinkProps) {
  const { children, className = "", variant = "solid", ...rest } = props;
  return (
    <a className={classes(variant, className)} {...rest}>
      {children}
    </a>
  );
}
