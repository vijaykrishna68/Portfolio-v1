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
        className={`absolute left-0 top-[23px] w-[14px] h-[14px] rounded-slab border-stroke ${INTERACTION.border} ${
          isOpen ? "bg-accent border-accent scale-110" : "bg-background border-line scale-100"
        }`}
      />
      <button onClick={onToggle} aria-expanded={isOpen} className={`w-full text-left py-6 border-b border-hairline group/btn ${INTERACTION.fast}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="type-label text-accent">{item.year}</span>
            <h3 className="mt-1 text-body font-medium text-foreground group-hover/btn:text-accent transition-colors duration-200">
              {item.title}
            </h3>
            <p className="mt-0.5 text-caption text-muted-foreground leading-[1.6] max-w-[34rem]">{item.short}</p>
          </div>
          <span className={`flex-shrink-0 mt-2 text-muted-foreground ${INTERACTION.icon}`}>
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-out`} style={{ maxHeight: isOpen ? "200px" : "0px" }}>
          <p className="mt-4 pt-4 border-t border-hairline text-caption text-ink-muted leading-[1.7] max-w-[40rem]">
            {item.detail}
          </p>
        </div>
      </button>
    </div>
  );
}