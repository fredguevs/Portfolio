import type { Rect } from "../Pixel";

// The conveyor under the KNAPP entry, in three layers so the middle one can move:
// the belt itself, the things riding on it, and the scanner arch they pass through.
// See components/Conveyor.tsx.

const floor = "var(--rule)";
const metal = "#4f4f4f";
const metalHi = "#6a6a6a";
const belt = "#3c3c3c";
const beltMark = "#575757";
const roller = "#8a8a8a";
const box = "#c9a06a";
const boxDark = "#a07c4a";
const tape = "#e8d3a6";
const tote = "#3d6fb0";
const toteDark = "#2c548a";
const laser = "#e05a4a";

export const conveyorWidth = 96;
export const conveyorHeight = 30;

export const conveyorBase: Rect[] = [
  [0, 29, 96, 1, floor],
  [4, 22, 88, 1, metalHi],
  [4, 23, 88, 2, belt],
  ...Array.from({ length: 11 }, (_, i) => [6 + i * 8, 25, 3, 2, roller] as const),
  [10, 27, 2, 2, metal],
  [46, 27, 2, 2, metal],
  [84, 27, 2, 2, metal],
];

// Everything here repeats every 96 units, so sliding it 96 to the right loops cleanly.
export const conveyorItems: Rect[] = [
  // marks on the belt, so you can see it moving
  ...Array.from({ length: 24 }, (_, i) => [i * 4 + 1, 23, 2, 1, beltMark] as const),

  [10, 13, 10, 9, box],
  [10, 13, 10, 1, tape],
  [14, 13, 2, 9, tape],
  [19, 13, 1, 9, boxDark],

  [32, 15, 8, 7, box],
  [32, 15, 8, 1, tape],
  [35, 15, 2, 7, tape],
  [39, 15, 1, 7, boxDark],

  [58, 11, 12, 11, box],
  [58, 11, 12, 1, tape],
  [63, 11, 2, 11, tape],
  [69, 11, 1, 11, boxDark],

  [77, 15, 12, 7, tote],
  [76, 15, 14, 1, toteDark],
  [79, 17, 8, 1, toteDark],
];

export const conveyorArch: Rect[] = [
  [45, 5, 9, 2, metal],
  [45, 7, 1, 15, metal],
  [53, 7, 1, 15, metal],
  ...Array.from({ length: 8 }, (_, i) => [49, 7 + i * 2, 1, 1, laser] as const),
];
