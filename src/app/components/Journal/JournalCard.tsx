import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import { Label } from "../shared/Label";
import { Slab } from "../shared/Slab";
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
      <Link to={`/journal/${article.slug}`} className={`lg:col-span-6 block group/card cursor-pointer ${INTERACTION.subtleLift} ${className}`.trim()}>
        <Slab padded={false} className="p-6 md:p-8 h-full">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Tag className="type-label px-2 py-0.5 rounded-slab bg-stone text-ink">{article.tags[0]}</Tag>
          <Label>{formatDate(article.publishedAt)}</Label>
          <Label>· {article.readTime} read</Label>
        </div>

        <h3
          className="text-display-card text-foreground leading-[0.95] mb-4 group-hover/card:text-accent transition-colors duration-200 max-w-[13ch] font-display"
        >
          {article.title}
        </h3>

        <p className="text-body text-ink-muted mb-7 max-w-[62ch]">{article.excerpt}</p>

        <span className="inline-flex items-center gap-2 text-caption text-foreground font-medium group-hover/card:gap-3 group-hover/card:text-accent transition-all duration-200">
          Read article <ArrowRight size={13} />
        </span>
        </Slab>
      </Link>
    );
  }

  return (
    <Link
      to={`/journal/${article.slug}`}
      className={`group/card cursor-pointer py-5 border-t border-hairline ${INTERACTION.subtleLift} ${className}`.trim()}
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
          <h4 className="text-body font-medium text-foreground leading-snug group-hover/card:text-accent transition-colors duration-200">
            {article.title}
          </h4>
          <p className="mt-1 text-caption text-muted-foreground line-clamp-1 leading-[1.55]">{article.excerpt}</p>
        </div>
        <ArrowUpRight size={14} className="flex-shrink-0 mt-0.5 text-muted-foreground group-hover/card:text-accent transition-colors duration-200" />
      </div>
    </Link>
  );
}
