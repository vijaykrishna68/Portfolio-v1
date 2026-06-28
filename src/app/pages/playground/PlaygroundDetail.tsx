import { Link, useParams, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Container } from "../../components/shared/Container";
import { getPlaygroundItem } from "../../lib/content";
import { MDX_COMPONENTS } from "../../lib/mdx/components";
import { INTERACTION } from "../../lib/interaction";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PlaygroundDetail() {
  const { slug } = useParams<{ slug: string }>();
  const item = getPlaygroundItem(slug!);

  usePageTitle(item?.title);

  if (!item) return <Navigate to="/404" replace />;

  const Body = item.Component;

  return (
    <article>
      {/* Back */}
      <div className="pt-24 pb-0">
        <Container>
          <Link
            to="/playground"
            className={`inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground ${INTERACTION.color}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft size={12} />
            Playground
          </Link>
        </Container>
      </div>

      {/* Header */}
      <section className="pt-10 pb-16 border-b border-border">
        <Container>
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className="text-[10px] uppercase tracking-widest text-[#68b1f5]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {item.tags[0]}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl text-foreground leading-[1.05] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </h1>

            <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[13px] px-4 py-2 bg-foreground text-background hover:bg-[#68b1f5] hover:text-white ${INTERACTION.border}`}
                >
                  Live demo <ArrowUpRight size={12} />
                </a>
              )}
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[13px] px-4 py-2 border border-border text-foreground hover:border-[#68b1f5] hover:text-[#68b1f5] ${INTERACTION.border}`}
                >
                  Source <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Cover */}
      {item.cover && (
        <div className="border-b border-border bg-muted">
          <div className="max-w-4xl mx-auto">
            <img
              src={item.cover}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <section className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Body components={MDX_COMPONENTS} />
          </div>
        </Container>
      </section>
    </article>
  );
}
