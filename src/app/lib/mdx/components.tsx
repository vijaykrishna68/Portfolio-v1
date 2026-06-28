import type { ComponentPropsWithoutRef } from "react";

export const MDX_COMPONENTS = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      {...props}
      style={{ fontFamily: "var(--font-display)" }}
      className="text-3xl text-foreground mt-12 mb-4 leading-tight"
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      {...props}
      style={{ fontFamily: "var(--font-display)" }}
      className="text-2xl text-foreground mt-10 mb-3 leading-tight"
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      {...props}
      style={{ fontFamily: "var(--font-display)" }}
      className="text-xl text-foreground mt-8 mb-2 leading-tight"
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p {...props} className="text-[15px] text-foreground/80 leading-[1.8] mb-5" />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className="list-disc pl-6 mb-5 space-y-1.5" />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className="list-decimal pl-6 mb-5 space-y-1.5" />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li {...props} className="text-[15px] text-foreground/80 leading-[1.7]" />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong {...props} className="font-semibold text-foreground" />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em {...props} className="italic text-foreground/70" />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      {...props}
      className="px-1.5 py-0.5 text-[13px] bg-muted border border-border text-[#68b1f5]"
      style={{ fontFamily: "var(--font-mono)" }}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      className="p-5 bg-muted border border-border overflow-x-auto mb-6 text-[13px] leading-relaxed"
      style={{ fontFamily: "var(--font-mono)" }}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className="pl-4 border-l-2 border-[#68b1f5]/30 text-foreground/60 italic my-6"
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr {...props} className="border-border my-10" />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className="text-[#68b1f5] underline underline-offset-2 hover:opacity-75 transition-opacity"
    />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img
      {...props}
      className="w-full border border-border my-6"
    />
  ),
};
