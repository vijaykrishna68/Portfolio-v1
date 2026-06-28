import { ChevronDown, ChevronUp } from "lucide-react";

import type { TimelineEntry } from "../../types/portfolio";
import { INTERACTION } from "../../lib/interaction";

type TimelineItemProps = {
  item: TimelineEntry;
  isOpen: boolean;
  onToggle: () => void;
};

export function TimelineItem({ item, isOpen, onToggle }: TimelineItemProps) {
  return (
    <div className="relative pl-8">
      <div
        className={`absolute left-0 top-[23px] w-[14px] h-[14px] border ${INTERACTION.border} ${
          isOpen ? "bg-[#ffdf60] border-[#ffdf60] scale-110 shadow-[0_0_0_4px_rgba(104,177,245,0.08)]" : "bg-background border-border scale-100"
        }`}
      />
      <button onClick={onToggle} className={`w-full text-left py-6 border-b border-border group/btn ${INTERACTION.fast}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-[#68b1f5] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              {item.year}
            </span>
            <h3 className="mt-1 text-[16px] font-medium text-foreground group-hover/btn:text-[#68b1f5] transition-colors duration-200">
              {item.title}
            </h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground leading-[1.6] max-w-[34rem]">{item.short}</p>
          </div>
          <span className={`flex-shrink-0 mt-2 text-muted-foreground ${INTERACTION.icon}`}>
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-out`} style={{ maxHeight: isOpen ? "200px" : "0px" }}>
          <p className="mt-4 pt-4 border-t border-border/50 text-[14px] text-foreground/65 leading-[1.7] max-w-[40rem]">
            {item.detail}
          </p>
        </div>
      </button>
    </div>
  );
}