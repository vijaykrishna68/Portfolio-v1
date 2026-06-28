import type { PlaygroundItem } from "../../types/portfolio";

type PlaygroundCardProps = {
  item: PlaygroundItem;
  className: string;
};

export function PlaygroundCard({ item, className }: PlaygroundCardProps) {
  return (
    <div className={`relative group overflow-hidden bg-muted cursor-pointer ${className} md:min-h-0 min-h-[160px]`}>
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/30 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-[9px] tracking-widest uppercase text-white/55 mb-1 block" style={{ fontFamily: "var(--font-mono)" }}>
          {item.tag}
        </span>
        <h3 className="text-[14px] font-medium text-white leading-tight">{item.title}</h3>
        <p className="text-[12px] text-white/55 mt-0.5 line-clamp-1">{item.desc}</p>
      </div>
    </div>
  );
}