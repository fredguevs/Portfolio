import type { Rect } from "../Pixel";

// The pictures at the top of the projects and links pages, and the Michigan patch
// on the experience page.

const floor = "var(--rule)";
const ink = "var(--pixel-ink)";
const white = "#ececec";
const metal = "#4f4f4f";
const wood = "#a77b52";
const woodDark = "#6b4a2f";
const green = "#3d7a55";
const greenDark = "#2c5a3e";
const leaf = "#5aa36f";
const red = "#c9503c";
const blue = "#3d6fb0";
const gray = "#8a8a8a";
const grayDark = "#6e6e6e";
const orange = "#f2b632";
const maize = "#ffcb05";
const navy = "#00274c";

// A shelf with one thing for each project: a tape for the video looper, a house for
// cost of living, a notebook for the journaling app, an asteroid and a ship.
const shelf: Rect[] = [
  [6, 20, 84, 2, wood],
  [6, 21, 84, 1, woodDark],
  [14, 22, 2, 4, woodDark],
  [80, 22, 2, 4, woodDark],

  // video tape
  [10, 12, 12, 8, ink],
  [12, 13, 8, 2, white],
  [12, 16, 3, 2, gray],
  [17, 16, 3, 2, gray],

  // house
  [32, 10, 2, 1, red],
  [31, 11, 4, 1, red],
  [30, 12, 6, 1, red],
  [29, 13, 8, 1, red],
  [29, 14, 8, 6, "#d9c7a7"],
  [32, 17, 2, 3, woodDark],
  [30, 15, 2, 2, blue],
  [35, 15, 1, 2, blue],

  // notebook
  [44, 9, 8, 11, green],
  [44, 9, 1, 11, greenDark],
  [46, 12, 4, 2, white],

  // asteroid
  [59, 13, 6, 7, gray],
  [58, 14, 8, 5, gray],
  [60, 15, 2, 2, grayDark],
  [63, 17, 1, 1, grayDark],

  // ship
  [73, 13, 1, 1, white],
  [72, 14, 3, 2, white],
  [71, 16, 5, 1, white],
  [70, 17, 7, 1, white],
  [73, 15, 1, 1, blue],
  [72, 18, 1, 2, orange],
  [74, 18, 1, 2, orange],
];

// A mailbox with the flag up and a paper plane on its way.
const mailbox: Rect[] = [
  [0, 34, 96, 1, floor],

  // grass
  [40, 32, 1, 2, leaf],
  [42, 31, 1, 3, leaf],
  [53, 32, 1, 2, leaf],
  [55, 31, 1, 3, leaf],

  // post
  [46, 16, 4, 18, woodDark],

  // box
  [37, 5, 18, 1, blue],
  [36, 6, 20, 10, blue],
  [36, 15, 20, 1, "#2c548a"],
  [36, 6, 2, 10, "#2c548a"],

  // letter sticking out
  [38, 3, 8, 3, white],
  [38, 3, 1, 1, gray],
  [45, 3, 1, 1, gray],
  [39, 4, 6, 1, gray],

  // flag
  [57, 4, 1, 11, metal],
  [57, 4, 5, 3, red],

  // paper plane and its trail
  [80, 4, 2, 1, white],
  [76, 5, 6, 1, white],
  [72, 6, 9, 1, white],
  [75, 7, 5, 1, gray],
  [77, 8, 2, 1, gray],
  ...Array.from({ length: 5 }, (_, i) => [62 + i * 2, 10 - (i % 2), 1, 1, gray] as const),
];

// A maize block M on a navy patch. Go Blue.
const blockM: Rect[] = [
  [0, 0, 26, 19, navy],
  ...(
    [
      [0, 0, 8, 2],
      [14, 0, 8, 2],
      [2, 2, 4, 11],
      [16, 2, 4, 11],
      [0, 13, 8, 2],
      [14, 13, 8, 2],
      [6, 2, 3, 1],
      [13, 2, 3, 1],
      [7, 3, 3, 1],
      [12, 3, 3, 1],
      [8, 4, 6, 1],
      [9, 5, 4, 1],
      [10, 6, 2, 1],
    ] as const
  ).map(([x, y, w, h]) => [x + 2, y + 2, w, h, maize] as const),
];

export const spots = {
  shelf: {
    width: 96,
    height: 26,
    rects: shelf,
    alt: "Pixel art of a shelf holding a video tape, a little house, a notebook, an asteroid and a rocket ship.",
  },
  mailbox: {
    width: 96,
    height: 35,
    rects: mailbox,
    alt: "Pixel art of a blue mailbox with its flag up and a letter sticking out, and a paper plane flying past.",
  },
  michigan: {
    width: 26,
    height: 19,
    rects: blockM,
    alt: "Pixel art of the University of Michigan block M, maize on blue.",
  },
};
