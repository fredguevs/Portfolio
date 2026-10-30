import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { PageIntro } from "@/components/PageIntro";
import { elsewhere } from "@/content/site";

export const metadata: Metadata = { title: "Links" };

export default function Links() {
  return (
    <>
      <PageIntro art="mailbox" title="links">
        where else to find me. email is best.
      </PageIntro>
      <ul className="mt-10 space-y-5">
        {elsewhere.map(({ label, href, display, icon }) => (
          <li key={label} className="flex items-center gap-4">
            <Icon name={icon} size={28} />
            <div>
              <p className="font-pixel text-[1rem] leading-tight">{label.toLowerCase()}</p>
              <a href={href}>{display}</a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
