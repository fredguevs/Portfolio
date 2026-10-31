import { ArtSlot } from "@/components/ArtSlot";
import { Desk } from "@/components/Desk";
import type { ArtName } from "@/components/art";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";

const interests: { label: string; art: ArtName }[] = [
  { label: "singing", art: "singing" },
  { label: "guitar", art: "guitar" },
  { label: "piano", art: "piano" },
  { label: "all things related to The Beatles", art: "beatles" },
  { label: "gaming", art: "gaming" },
  { label: "cooking delicious food", art: "cooking" },
];

export default function Home() {
  return (
    <>
      <PageIntro picture={<Desk />} title="hi! i’m frederick">
        developer, music enthusiast, gamer
      </PageIntro>

      <Section title="about me">
        <p>
          I&rsquo;m an Atlanta-based software developer and a software engineer at{" "}
          <a href="https://www.knapp.com">KNAPP</a>, where I work on automating supply
          chain and intralogistics operations. Outside of work, I build full-stack web
          applications.
        </p>
        <p>
          I studied computer science at the{" "}
          <a href="https://umich.edu">University of Michigan</a>. Go Blue!
        </p>
      </Section>

      <Section title="other interests">
        <ul className="space-y-3">
          {interests.map(({ label, art }) => (
            <li key={label} className="flex items-center gap-3">
              <ArtSlot name={art} decorative className="size-7 shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="languages">
        <div className="space-y-3 border-l-2 border-rule pl-4">
          <p>
            I&rsquo;m fluent in English and can speak conversational Russian/Русский.
          </p>
          <p className="text-[0.9375rem] text-muted">
            I also know some Spanish from school, and very basic Tagalog.
          </p>
        </div>
      </Section>
    </>
  );
}
