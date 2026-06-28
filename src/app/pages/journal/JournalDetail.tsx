import { Link, useParams, Navigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "../../components/shared/Container";
import { getJournalPost, getJournalPosts, formatDate } from "../../lib/content";
import { MDX_COMPONENTS } from "../../lib/mdx/components";
import { INTERACTION } from "../../lib/interaction";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function JournalDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = getJournalPost(slug!);

  usePageTitle(post?.title);

  if (!post) return <Navigate to="/404" replace />;

  const Body = post.Component;

  const posts = getJournalPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  const prev = idx < posts.length - 1 ? posts[idx + 1] : undefined;
  const next = idx > 0 ? posts[idx - 1] : undefined;

  return (
    <article>
      {/* Back */}
      <div className="pt-24 pb-0">
        <Container>
          <Link
            to="/journal"
            className={`inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground ${INTERACTION.color}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft size={12} />
            All articles
          </Link>
        </Container>
      </div>

      {/* Header */}
      <section className="pt-10 pb-16 border-b border-border">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div
              className="flex flex-wrap items-center gap-3 mb-8 text-[11px] text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-[#68b1f5]">{post.tags[0]}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{post.readTime} read</span>
            </div>

            <h1
              className="text-4xl md:text-5xl text-foreground leading-[1.05] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {post.title}
            </h1>

            <p className="text-[16px] text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="py-16 border-b border-border">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Body components={MDX_COMPONENTS} />
          </div>
        </Container>
      </section>

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto flex justify-between gap-8">
              {prev ? (
                <Link
                  to={`/journal/${prev.slug}`}
                  className={`group flex-1 text-left ${INTERACTION.color}`}
                >
                  <span
                    className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <ArrowLeft size={10} /> Older
                  </span>
                  <span className="text-[14px] text-foreground group-hover:text-[#68b1f5] transition-colors leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to={`/journal/${next.slug}`}
                  className={`group flex-1 text-right ${INTERACTION.color}`}
                >
                  <span
                    className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center justify-end gap-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Newer <ArrowRight size={10} />
                  </span>
                  <span className="text-[14px] text-foreground group-hover:text-[#68b1f5] transition-colors leading-snug">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </Container>
        </nav>
      )}
    </article>
  );
}
