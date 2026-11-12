import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import { Tag } from "../shared/Tag";
import { type JournalPost, formatDate } from "../../lib/content";
import { INTERACTION } from "../../lib/interaction";

type JournalCardProps = {
  article: JournalPost;
  featured?: boolean;
  className?: string;
};

export function JournalCard({ article, featured = false, className = "" }: JournalCardProps) {
  if (featured) {
    return (
      <Link to={`/journal/${article.slug}`} className={`lg:col-span-6 border-t-2 border-foreground pt-8 group/card cursor-pointer rounded-slab ${INTERACTION.subtleLift} ${className}`.trim()}>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Tag
            className={`px-2 py-0.5 text-label border border-accent text-accent tracking-wider bg-accent/5 ${INTERACTION.border} font-mono`}
          >
            {article.tags[0]}
          </Tag>
          <span className="text-label text-muted-foreground font-mono">
            {formatDate(article.publishedAt)}
          </span>
          <span className="text-label text-muted-foreground font-mono">
            · {article.readTime} read
          </span>
        </div>

        <h3
          className="text-display-card text-foreground leading-[1.08] mb-4 group-hover/card:text-accent transition-colors duration-200 max-w-[13ch] font-display"
        >
          {article.title}
        </h3>

        <p className="text-[15px] text-muted-foreground leading-[1.7] mb-7 max-w-[34rem]">{article.excerpt}</p>

        <span className="inline-flex items-center gap-2 text-[13px] text-foreground font-medium group-hover/card:gap-3 group-hover/card:text-accent transition-all duration-200">
          Read article <ArrowRight size={13} />
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/journal/${article.slug}`}
      className={`group/card cursor-pointer py-5 border-t border-border hover:border-accent/25 ${INTERACTION.subtleLift} ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-label tracking-wider text-muted-foreground uppercase font-mono">
              {article.tags[0]}
            </span>
            <span className="text-muted-foreground/40 text-label">·</span>
            <span className="text-label text-muted-foreground font-mono">
              {article.readTime}
            </span>
          </div>
          <h4 className="text-[15px] font-medium text-foreground leading-snug group-hover/card:text-accent transition-colors duration-200">
            {article.title}
          </h4>
          <p className="mt-1 text-[13px] text-muted-foreground line-clamp-1 leading-[1.55]">{article.excerpt}</p>
        </div>
        <ArrowUpRight size={14} className="flex-shrink-0 mt-0.5 text-muted-foreground group-hover/card:text-accent transition-colors duration-200" />
      </div>
    </Link>
  );
}
