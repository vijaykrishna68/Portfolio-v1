import { Link } from "react-router";
import { type PlaygroundItem } from "../../lib/content";

type PlaygroundCardProps = {
  item: PlaygroundItem;
  className: string;
};

// Playground's hover language is deliberately its own — a small tactile
// tilt + a dashed accent border (a "sketch/experiment" cue Project cards
// never use), instead of Project's vertical lift + solid-border + glow.
// Kept to transform/opacity/border-color only, same restraint as everywhere
// else on the site, and — like every other hover-only transition already in
// this codebase — not gated behind prefers-reduced-motion.
export function PlaygroundCard({ item, className }: PlaygroundCardProps) {
  return (
    <Link
      to={`/playground/${item.slug}`}
      className={`relative group overflow-hidden bg-stone cursor-pointer border-stroke border-line rounded-slab transition-transform duration-200 ease-out hover:z-10 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className} md:min-h-0 min-h-[160px]`}
    >
      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
      <div className="playground-scrim absolute inset-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-label tracking-widest uppercase text-glass-ink mb-1 block font-mono">
          {item.tags[0]}
        </span>
        <h3 className="text-caption font-medium text-glass-ink leading-tight">{item.title}</h3>
        <p className="text-caption text-glass-ink mt-0.5 line-clamp-1">{item.summary}</p>
      </div>
    </Link>
  );
}
