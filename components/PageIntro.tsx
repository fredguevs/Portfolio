import type { ReactNode } from "react";
import { ArtSlot } from "./ArtSlot";
import type { ArtName } from "./art";

// The top of every page: its picture (if it has one), the page title, and a line under
// it. The picture is either a plain illustration (`art`) or one you can play with
// (`picture`, like the desk or the shelf).
export function PageIntro({
  art,
  picture,
  title,
  children,
}: {
  art?: ArtName;
  picture?: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <>
      {art ? <ArtSlot name={art} className="mb-10 w-full" /> : null}
      {picture ? <div className="mb-10">{picture}</div> : null}
      <h1 className="font-pixel text-[2.5rem] leading-tight">{title}</h1>
      {children ? <p className="mt-2 text-muted">{children}</p> : null}
    </>
  );
}
