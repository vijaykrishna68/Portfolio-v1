import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Container } from "../shared/Container";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { getJournalPosts, getFeaturedJournalPost } from "../../lib/content";

import { JournalCard } from "./JournalCard";

export function Journal() {
  const featured = getFeaturedJournalPost()!;
  const rest = getJournalPosts().filter((post) => !post.featured);

  return (
    <section id="journal" className="py-36 border-t border-border">
      <Container>
        <div className="flex items-end justify-between mb-[4.5rem]">
          <Reveal>
            <div>
              <SectionLabel>Engineering Journal</SectionLabel>
              <h2 className="mt-3 max-w-[10ch] text-3xl md:text-4xl text-foreground leading-[1.08]" style={{ fontFamily: "var(--font-display)" }}>
                Writing through ideas.
              </h2>
            </div>
          </Reveal>
          <Link
            to="/journal"
            className="hidden md:flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors group"
          >
            All articles
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Reveal wraps the grid so the featured card's internal lg:col-span-6 stays intact */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <JournalCard article={featured} featured />

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col">
            {rest.map((article, index) => (
              <JournalCard key={article.slug} article={article} className={index === rest.length - 1 ? "border-b" : ""} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
