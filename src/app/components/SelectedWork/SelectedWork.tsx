import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Container } from "../shared/Container";
import { SectionLabel } from "../shared/SectionLabel";
import { getProjects } from "../../lib/content";

import { ProjectCard } from "./ProjectCard";

export function SelectedWork() {
  const projects = getProjects();

  return (
    <section id="work" className="py-36 border-t border-border">
      <Container>
        <div className="flex items-end justify-between mb-[4.5rem]">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="mt-3 text-3xl md:text-4xl text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Three projects that shaped me.
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors group"
          >
            All projects
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div>
          {projects.map((project, index) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} className="block">
              <ProjectCard project={project} isLast={index === projects.length - 1} />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}