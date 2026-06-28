import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

import { Container } from "../../components/shared/Container";
import { SectionLabel } from "../../components/shared/SectionLabel";
import { getJournalPosts, formatDate } from "../../lib/content";
import { INTERACTION } from "../../lib/interaction";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function JournalIndex() {
  usePageTitle("Journal");
  const posts = getJournalPosts();

  return (
    <section className="pt-36 pb-24">
      <Container>
        <div className="mb-[4.5rem]">
          <SectionLabel>Engineering Journal</SectionLabel>
          <h1
            className="mt-3 text-3xl md:text-4xl text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            All articles
          </h1>
        </div>

        {posts.length === 0 && (
          <p className="text-[15px] text-muted-foreground py-16">No articles yet.</p>
        )}
        <div className="max-w-2xl">
          {posts.map((post) => (
            <Link key={post.slug} to={`/journal/${post.slug}`} className="block">
              <div
                className={`group/card py-6 border-t border-border hover:border-[#68b1f5]/25 ${INTERACTION.subtleLift}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] tracking-wider text-muted-foreground uppercase"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {post.tags[0]}
                      </span>
                      <span className="text-muted-foreground/40 text-[10px]">·</span>
                      <span
                        className="text-[10px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="text-muted-foreground/40 text-[10px]">·</span>
                      <span
                        className="text-[10px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-[17px] font-medium text-foreground leading-snug group-hover/card:text-[#68b1f5] transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 text-[13px] text-muted-foreground leading-[1.6] line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="flex-shrink-0 mt-1 text-muted-foreground group-hover/card:text-[#68b1f5] transition-colors duration-200"
                  />
                </div>
              </div>
            </Link>
          ))}
          {posts.length > 0 && <div className="border-b border-border" />}
        </div>
      </Container>
    </section>
  );
}
