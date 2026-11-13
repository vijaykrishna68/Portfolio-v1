import { Link, useParams, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { ButtonLink } from "../../components/shared/Button";
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
            className={`inline-flex items-center gap-2 text-caption text-muted-foreground hover:text-foreground ${INTERACTION.color} font-mono`}
          >
            <ArrowLeft size={12} />
            Playground
          </Link>
        </Container>
      </div>

      {/* Header */}
      <section className="pt-10 pb-16 border-b border-hairline">
        <Container>
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className="text-label uppercase tracking-widest text-accent font-mono"
              >
                {item.tags[0]}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl text-foreground leading-[0.95] mb-5 font-display"
            >
              {item.title}
            </h1>

            <p className="text-body text-muted-foreground leading-relaxed mb-8">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {item.demoUrl && (
                <ButtonLink variant="solid" href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                  Live demo <ArrowUpRight size={12} />
                </ButtonLink>
              )}
              {item.sourceUrl && (
                <ButtonLink variant="outline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Source <ArrowUpRight size={12} />
                </ButtonLink>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Cover */}
      {item.cover && (
        <section className="py-10 border-b border-hairline">
          <Container>
            <div className="max-w-4xl mx-auto overflow-hidden border-stroke border-line rounded-slab bg-stone">
              <img
                src={item.cover}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          </Container>
        </section>
      )}

      {/* Body */}
      <section className="py-16">
        <Container>
          <div className="max-w-[62ch] mx-auto">
            <Body components={MDX_COMPONENTS} />
          </div>
        </Container>
      </section>
    </article>
  );
}
