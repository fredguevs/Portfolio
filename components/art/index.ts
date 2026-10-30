import type { Rect } from "../Pixel";
import { desk } from "./desk";
import { interests } from "./interests";
import { spots } from "./spots";

// Every illustration on the site, by name. Each one is drawn in code, but any of
// them can be replaced with your own picture: drop a PNG in /public/art/ and set
// `src`, e.g. desk: { ...desk, src: "/art/desk.png" }. Keep roughly the same shape
// (width:height) so the layout doesn't jump.

export type Art = {
  width: number;
  height: number;
  rects: readonly Rect[];
  alt: string;
  src?: string;
};

export const art = {
  desk,
  ...spots,
  ...interests,
} satisfies Record<string, Art>;

export type ArtName = keyof typeof art;
