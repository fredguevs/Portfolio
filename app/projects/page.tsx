import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProjectEntry } from "@/components/ProjectEntry";
import { Shelf } from "@/components/Shelf";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <>
      <PageIntro picture={<Shelf />} title="projects">
        things i&rsquo;ve built, newest first.
      </PageIntro>
      <ul className="mt-12 space-y-12">
        {projects.map((project) => (
          <ProjectEntry key={project.title} project={project} />
        ))}
      </ul>
    </>
  );
}
