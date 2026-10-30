import { ArtSlot } from "@/components/ArtSlot";
import type { ArtName } from "@/components/art";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";

const interests: { label: string; art: ArtName }[] = [
  { label: "linux", art: "linux" },
  { label: "programming", art: "programming" },
  { label: "ai", art: "ai" },
  { label: "automation", art: "automation" },
  { label: "building tools", art: "tools" },
  { label: "learning new things", art: "learning" },
  { label: "guitar", art: "guitar" },
];

export default function Home() {
  return (
    <>
      <PageIntro art="desk" title="hi — i’m frederick">
        software engineer, working on warehouse automation.
      </PageIntro>

      <p className="mt-8">
        This is where I keep the things I&rsquo;ve made and the things I&rsquo;m into.
      </p>

      <Section title="what i do">
        <p>
          I&rsquo;m a software systems engineer at <a href="https://www.knapp.com">KNAPP</a>.
          I work on the C++ and XML workflows behind automated warehouse systems, dig
          through Linux logs and Oracle SQL when something breaks, and write Bash and Python
          scripts to automate testing.
        </p>
        <p>
          I studied computer science at the{" "}
          <a href="https://umich.edu">University of Michigan</a> and graduated in 2025.
        </p>
      </Section>

      <Section title="things i like">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {interests.map(({ label, art }) => (
            <li key={label} className="flex items-center gap-3">
              <ArtSlot name={art} decorative className="size-7 shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
