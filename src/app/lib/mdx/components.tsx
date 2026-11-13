import type { ComponentPropsWithoutRef } from "react";

/**
 * Styles for rendered MDX bodies (Earned Light tokens). The detail pages wrap the
 * body in a 62ch measure. Sub-heads are Hanken Grotesk 600 in sentence case, not
 * display type, so a heading that is a full sentence never sets in Anybody.
 * Verdigris is used for links only (text on ground, 4.5:1 or better); code and
 * blockquotes use ink so nothing falls below the contrast floor.
 */
export const MDX_COMPONENTS = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 {...props} className="font-text font-semibold text-subhead text-ink mt-12 mb-4" />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 {...props} className="font-text font-semibold text-subhead text-ink mt-10 mb-3" />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 {...props} className="font-text font-semibold text-body text-ink mt-8 mb-2" />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => <p {...props} className="text-body text-ink mb-5" />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul {...props} className="list-disc pl-6 mb-5 space-y-1.5" />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol {...props} className="list-decimal pl-6 mb-5 space-y-1.5" />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} className="text-body text-ink" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => <strong {...props} className="font-semibold text-ink" />,
  // Hanken Grotesk is loaded upright only (400, 600): no synthetic italics.
  em: (props: ComponentPropsWithoutRef<"em">) => <em {...props} className="not-italic font-semibold text-ink-muted" />,
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code {...props} className="px-1.5 py-0.5 text-caption bg-stone text-ink rounded-slab font-mono" />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      {...props}
      className="p-5 bg-panel text-ink border-stroke border-line rounded-slab overflow-x-auto mb-6 text-caption font-mono [&_code]:!p-0 [&_code]:!bg-transparent"
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote {...props} className="pl-4 border-l-[length:var(--stroke-slab)] border-accent text-ink-muted my-6" />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => <hr {...props} className="border-hairline my-10" />,
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a {...props} className="text-accent underline underline-offset-2 hover:no-underline transition-[text-decoration] duration-200" />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img {...props} className="w-full border-stroke border-line rounded-slab my-6" />
  ),
  // GFM tables (remark-gfm): a scrolling slab, 1.5px outline, hairline row dividers.
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto my-6 border-stroke border-line rounded-slab">
      <table {...props} className="w-full text-caption text-left border-collapse" />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th {...props} className="type-label bg-stone text-ink px-3 py-2 border-b border-line" />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => <td {...props} className="px-3 py-2 text-ink border-b border-hairline" />,
};
