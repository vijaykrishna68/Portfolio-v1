import { Link } from "react-router";

import { Container } from "../../components/shared/Container";
import { SectionLabel } from "../../components/shared/SectionLabel";
import { getProjects } from "../../lib/content";
import { ProjectCard } from "../../components/SelectedWork/ProjectCard";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProjectsIndex() {
  usePageTitle("Projects");
  const projects = getProjects();

  return (
    <section className="pt-36 pb-24 border-t border-border">
      <Container>
        <div className="mb-[4.5rem]">
          <SectionLabel>All Work</SectionLabel>
          <h1
            className="mt-3 text-3xl md:text-4xl text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projects
          </h1>
        </div>

        {projects.length === 0 ? (
          <p className="text-[15px] text-muted-foreground py-16">No projects yet.</p>
        ) : (
          <div>
            {projects.map((project, index) => (
              <Link key={project.slug} to={`/projects/${project.slug}`} className="block">
                <ProjectCard project={project} isLast={index === projects.length - 1} />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
