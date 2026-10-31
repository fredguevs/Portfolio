import type { Metadata } from "next";
import { Conveyor } from "@/components/Conveyor";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { VictorsButton } from "@/components/VictorsButton";
import { education, jobs, skills } from "@/content/experience";

export const metadata: Metadata = { title: "Experience" };

export default function Experience() {
  return (
    <>
      <PageIntro title="experience" />

      <Section title="work">
        {jobs.map((job) => (
          <div key={job.company + job.when}>
            <Heading title={job.href ? <a href={job.href}>{job.company}</a> : job.company} when={job.when} />
            <p className="text-muted">
              {job.role} · {job.where}
            </p>
            <div className="mt-3 space-y-4">
              {job.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {job.illustration === "conveyor" ? <Conveyor className="mt-8 w-full" /> : null}
          </div>
        ))}
      </Section>

      <Section title="education">
        <div className="flex items-center gap-5">
          <VictorsButton className="w-16 shrink-0 sm:w-20" />
          <div className="flex-1">
            <Heading title={education.school} when={education.when} />
            <p className="text-muted">
              {education.degree} · {education.where}
            </p>
          </div>
        </div>
      </Section>

      <Section title="skills">
        <dl className="space-y-1.5">
          {skills.map(({ label, items }) => (
            <div key={label} className="grid gap-x-4 sm:grid-cols-[7.5rem_1fr]">
              <dt className="text-muted">{label.toLowerCase()}</dt>
              <dd>{items}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}

function Heading({ title, when }: { title: React.ReactNode; when: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <h3 className="text-[1.125rem] font-semibold">{title}</h3>
      <span className="text-[0.875rem] text-muted">{when}</span>
    </div>
  );
}
