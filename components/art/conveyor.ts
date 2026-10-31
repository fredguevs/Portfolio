import type { Rect } from "../Pixel";

// The conveyor under the KNAPP entry, in layers so the middle ones can move: the
// belt on its frame, the things riding on it (the tote, and the cartons, which you
// can open), and the barcode scanner they pass under. See components/Conveyor.tsx.

const floor = "var(--rule)";
const metal = "#4f4f4f";
const metalHi = "#6a6a6a";
const metalDark = "#3a3a3a";
const belt = "#3c3c3c";
const beltMark = "#575757";
const bolt = "#8a8a8a";
const motor = "#3e4a59";
const motorDark = "#2e3742";
const box = "#c9a06a";
const boxDark = "#a07c4a";
const boxInside = "#6e5434";
const tape = "#e8d3a6";
const label = "#f2efe6";
const bars = "#2a2a2a";
const print = "#a8a49a";
const tote = "#3d6fb0";
const toteDark = "#2c548a";
const housing = "#5b6675";
const housingHi = "#7a8695";
const glass = "#262a30";
const laser = "#e05a4a";

export const conveyorWidth = 96;
export const conveyorHeight = 36;

// The part of the belt things are visible on; they appear and disappear at its ends.
export const beltLeft = 4;
export const beltRight = 92;

// How far the moving layer slides before it repeats. Longer than the drawing, so
// there's a stretch off the end of the belt where nothing shows and a carton can
// quietly close before it comes round again. Matches .conveyor-move in globals.css.
export const conveyorLoop = 112;

export const conveyorBase: Rect[] = [
  [0, 35, 96, 1, floor],

  // two pairs of legs with a rail between them, and feet on the floor
  [8, 27, 2, 7, metal],
  [86, 27, 2, 7, metal],
  [7, 34, 4, 1, metalDark],
  [85, 34, 4, 1, metalDark],
  [10, 31, 76, 1, metalDark],

  // the motor that drives the belt, hanging under the far end
  [72, 27, 9, 4, motor],
  [72, 27, 9, 1, motorDark],
  ...Array.from({ length: 3 }, (_, i) => [74 + i * 2, 28, 1, 3, motorDark] as const),
  [81, 28, 2, 2, metalDark], // gearbox

  // the side of the frame, with the ends of the rollers bolted through it
  [2, 25, 92, 2, metal],
  ...Array.from({ length: 12 }, (_, i) => [5 + i * 8, 25, 1, 1, bolt] as const),

  // the belt, wrapping round a drum at each end
  [4, 22, 88, 1, metalHi, "cat-belt"], // the cat rides this (lib/surfaces.ts)
  [4, 23, 88, 2, belt],
  [3, 23, 1, 2, belt],
  [92, 23, 1, 2, belt],
];

// The tote and the marks on the belt. Everything on the moving layer repeats every
// conveyorLoop units, so sliding it that far to the right loops cleanly.
export const conveyorItems: Rect[] = [
  ...Array.from({ length: conveyorLoop / 4 }, (_, i) => [i * 4 + 1, 23, 2, 1, beltMark] as const),

  [81, 15, 12, 7, tote],
  [80, 15, 14, 1, toteDark],
  [83, 17, 8, 1, toteDark],
  ...barcode(84, 19),
];

// A shipping label, 6 by 3: a line of print, and a barcode under it.
function barcode(x: number, y: number): Rect[] {
  return [
    [x, y, 6, 3, label],
    [x + 1, y, 3, 1, print],
    ...Array.from({ length: 3 }, (_, i) => [x + 1 + i * 2, y + 1, 1, 2, bars] as const),
  ];
}

export type Carton = { x: number; top: number; w: number; h: number };

// Every carton stands on the belt (its bottom row is y 21).
export const cartons: Carton[] = [
  { x: 6, top: 13, w: 10, h: 9 },
  { x: 30, top: 15, w: 8, h: 7 },
  { x: 54, top: 11, w: 12, h: 11 },
];

// A carton, taped shut or open with its end flaps folded out. The flaps have a
// class so the cat doesn't try to stand on them (lib/surfaces.ts).
export function cartonRects({ x, top, w, h }: Carton, open: boolean): Rect[] {
  const mid = x + Math.floor(w / 2) - 1;
  return [
    [x, top, w, h, box],
    [x + w - 1, top, 1, h, boxDark],
    ...barcode(x + Math.floor((w - 7) / 2), top + h - 4),
    ...(open
      ? ([
          [x, top, w, 1, boxInside],
          [mid, top + 1, 2, 1, tape], // the cut tape
          [x - 1, top - 1, 2, 1, box, "carton-flap"],
          [x - 2, top - 2, 2, 1, box, "carton-flap"],
          [x - 3, top - 3, 2, 1, box, "carton-flap"],
          [x + w - 1, top - 1, 2, 1, boxDark, "carton-flap"],
          [x + w, top - 2, 2, 1, boxDark, "carton-flap"],
          [x + w + 1, top - 3, 2, 1, boxDark, "carton-flap"],
        ] as const)
      : ([
          [x, top, w, 1, tape],
          [mid, top + 1, 2, 1, tape],
        ] as const)),
  ];
}

// What can be in a carton: the kinds of things a warehouse ships. Each one is drawn
// from its own top-left corner, w by h.
export type Contents = { name: string; w: number; h: number; rects: Rect[] };

const Y = "#f2c94c";
const O = "#e8873a";
const K = "#2a2a2a";
const W = "#f2efe6";

export const contents: Contents[] = [
  {
    name: "a rubber duck",
    w: 6,
    h: 5,
    rects: [
      [3, 0, 2, 1, Y],
      [3, 1, 1, 1, Y],
      [4, 1, 1, 1, K],
      [5, 1, 1, 1, O],
      [0, 2, 1, 1, Y],
      [3, 2, 2, 1, Y],
      [0, 3, 5, 1, Y],
      [1, 4, 3, 1, Y],
    ],
  },
  {
    // The bottom row is behind the rim of the carton, so the sole sits on it.
    name: "a sneaker",
    w: 7,
    h: 5,
    rects: [
      [1, 0, 2, 1, "#d9534f"],
      [1, 1, 3, 1, "#d9534f"],
      [4, 1, 1, 1, W],
      [0, 2, 7, 1, "#d9534f"],
      [0, 3, 7, 1, "#8a8a8a"],
    ],
  },
  {
    name: "a toy rocket",
    w: 5,
    h: 7,
    rects: [
      [2, 0, 1, 1, "#d9534f"],
      [1, 1, 3, 5, "#b8bfc8"],
      [2, 2, 1, 1, "#3d6fb0"],
      [0, 4, 1, 2, "#d9534f"],
      [4, 4, 1, 2, "#d9534f"],
    ],
  },
  {
    name: "a basketball",
    w: 5,
    h: 5,
    rects: [
      [1, 0, 3, 1, O],
      [0, 1, 5, 3, O],
      [1, 4, 3, 1, O],
      [2, 0, 1, 5, K],
      [0, 2, 5, 1, K],
    ],
  },
  {
    name: "a book",
    w: 5,
    h: 6,
    rects: [
      [0, 0, 5, 6, "#4f8a5b"],
      [0, 0, 1, 6, "#3b6a45"],
      [2, 1, 2, 1, tape],
    ],
  },
  {
    // The bottom row is behind the rim of the carton, so the grips sit on it.
    name: "a game controller",
    w: 7,
    h: 4,
    rects: [
      [1, 0, 5, 1, "#5b6675"],
      [0, 1, 7, 1, "#5b6675"],
      [0, 2, 2, 1, "#5b6675"],
      [5, 2, 2, 1, "#5b6675"],
      [1, 1, 1, 1, K],
      [4, 1, 1, 1, "#4fae5b"],
      [5, 1, 1, 1, "#d9534f"],
    ],
  },
];

// The barcode scanner the belt runs through: a box on two posts, with a fan of red
// laser light shining down from a window underneath. The light on its side blinks green
// as each label goes under (.scan-light in globals.css). The posts are drawn over
// the moving layer, so things pass behind them.
export const conveyorArch: Rect[] = [
  [44, 8, 2, 17, metal],
  [54, 8, 2, 17, metal],
  [44, 8, 1, 17, metalHi],
  [54, 8, 1, 17, metalHi],

  [42, 2, 16, 6, housing],
  [42, 2, 16, 1, housingHi],
  [44, 7, 12, 1, glass],
  [49, 7, 2, 1, laser],
  [45, 4, 6, 2, glass],
  [54, 4, 2, 2, "#2e3a30", "scan-light"],

  // the edges of the fan
  ...Array.from({ length: 14 }, (_, k) => [49 - Math.floor(k / 4), 8 + k, 1, 1, laser, "scan-beam"] as const),
  ...Array.from({ length: 14 }, (_, k) => [50 + Math.floor(k / 4), 8 + k, 1, 1, laser, "scan-beam"] as const),
];
