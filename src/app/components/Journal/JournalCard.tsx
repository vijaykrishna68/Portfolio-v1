import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Tag } from "../shared/Tag";
import type { JournalArticle } from "../../types/portfolio";
import { INTERACTION } from "../../lib/interaction";

type JournalCardProps = {
  article: JournalArticle;
  featured?: boolean;
  className?: string;
};

export function JournalCard({ article, featured = false, className = "" }: JournalCardProps) {
  if (featured) {
    return (
      <div className={`lg:col-span-6 border-t-2 border-foreground pt-8 group/card cursor-pointer rounded-[12px] ${INTERACTION.subtleLift} ${className}`.trim()}>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Tag
            className={`px-2 py-0.5 text-[10px] border border-[#68b1f5] text-[#68b1f5] tracking-wider bg-[rgba(104,177,245,0.04)] ${INTERACTION.border}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {article.tag}
          </Tag>
          <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            {article.date}
          </span>
          <span className="text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            · {article.readTime} read
          </span>
        </div>

        <h3
          className="text-foreground leading-[1.08] mb-4 group-hover/card:text-[#68b1f5] transition-colors duration-200 max-w-[13ch]"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.35rem)" }}
        >
          {article.title}
        </h3>

        <p className="text-[15px] text-muted-foreground leading-[1.7] mb-7 max-w-[34rem]">{article.excerpt}</p>

        <span className="inline-flex items-center gap-2 text-[13px] text-foreground font-medium group-hover/card:gap-3 group-hover/card:text-[#68b1f5] transition-all duration-200">
          Read article <ArrowRight size={13} />
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group/card cursor-pointer py-5 border-t border-border hover:border-[#68b1f5]/25 ${INTERACTION.subtleLift} ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] tracking-wider text-muted-foreground uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              {article.tag}
            </span>
            <span className="text-muted-foreground/40 text-[10px]">·</span>
            <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              {article.readTime}
            </span>
          </div>
          <h4 className="text-[15px] font-medium text-foreground leading-snug group-hover/card:text-[#68b1f5] transition-colors duration-200">
            {article.title}
          </h4>
          <p className="mt-1 text-[13px] text-muted-foreground line-clamp-1 leading-[1.55]">{article.excerpt}</p>
        </div>
        <ArrowUpRight size={14} className="flex-shrink-0 mt-0.5 text-muted-foreground group-hover/card:text-[#68b1f5] transition-colors duration-200" />
      </div>
    </div>
  );
}