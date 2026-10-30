import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-3 font-pixel text-[1.25rem]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
