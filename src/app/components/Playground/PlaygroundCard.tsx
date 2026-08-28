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
      className={`relative group overflow-hidden bg-muted cursor-pointer border border-dashed border-transparent transition-[transform,border-color] duration-200 ease-out hover:z-10 hover:scale-[1.015] hover:-rotate-[0.4deg] hover:border-[#68b1f5]/45 ${className} md:min-h-0 min-h-[160px]`}
    >
      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/30 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <span className="text-[9px] tracking-widest uppercase text-white/55 mb-1 block" style={{ fontFamily: "var(--font-mono)" }}>
          {item.tags[0]}
        </span>
        <h3 className="text-[14px] font-medium text-white leading-tight">{item.title}</h3>
        <p className="text-[12px] text-white/55 mt-0.5 line-clamp-1">{item.summary}</p>
      </div>
    </Link>
  );
}
