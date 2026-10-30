import type { ReactNode } from "react";
import { ArtSlot } from "./ArtSlot";
import type { ArtName } from "./art";

// The top of every page: its picture (if it has one), the page title, and a line under it.
export function PageIntro({ art, title, children }: { art?: ArtName; title: string; children?: ReactNode }) {
  return (
    <>
      {art ? <ArtSlot name={art} className="mb-10 w-full" /> : null}
      <h1 className="font-pixel text-[2.5rem] leading-tight">{title}</h1>
      {children ? <p className="mt-2 text-muted">{children}</p> : null}
    </>
  );
}
