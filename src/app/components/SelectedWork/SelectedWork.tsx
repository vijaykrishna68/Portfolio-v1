import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Container } from "../shared/Container";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { getFeaturedProjects } from "../../lib/content";

import { ProjectCard } from "./ProjectCard";

export function SelectedWork() {
  const [primary, ...rest] = getFeaturedProjects();

  return (
    <section id="work" className="py-36 border-t border-border">
      <Container>
        <div className="flex items-end justify-between mb-[4.5rem]">
          <Reveal>
            <div>
              <SectionLabel>Selected Work</SectionLabel>
              <h2 className="mt-3 text-3xl md:text-4xl text-foreground tracking-tight font-display">
                Three projects that shaped me.
              </h2>
            </div>
          </Reveal>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground transition-colors group"
          >
            All projects
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {primary && (
          <Reveal>
            <Link to={`/projects/${primary.slug}`} className="block">
              <ProjectCard project={primary} variant="dominant" />
            </Link>
          </Reveal>
        )}

        {rest.length > 0 && (
          <Reveal delay={100} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rest.map((project) => (
              <Link key={project.slug} to={`/projects/${project.slug}`} className="block h-full">
                <ProjectCard project={project} variant="compact" />
              </Link>
            ))}
          </Reveal>
        )}
      </Container>
    </section>
  );
}
