import type { Rect } from "../Pixel";

// Small 12×12 icons for "things I like". Decorative: the label sits next to each one.

// Follows the theme, so the penguin doesn't vanish on a dark background.
const ink = "var(--pixel-ink)";
const white = "#f2f2f2";
const orange = "#f2b632";
const frame = "#4f4f4f";
const screen = "#12261b";
const green = "#6fcf8f";
const dimGreen = "#3f8f5c";
const steel = "#8a8a8a";
const steelDark = "#5e5e5e";
const wood = "#a0703f";
const guitar = "#c8873a";
const neck = "#5a3a22";

const icon = (rects: Rect[], alt: string) => ({ width: 12, height: 12, rects, alt });

export const interests = {
  linux: icon(
    [
      [3, 1, 6, 10, ink],
      [4, 4, 4, 6, white],
      [4, 2, 1, 1, white],
      [7, 2, 1, 1, white],
      [5, 3, 2, 1, orange],
      [2, 11, 3, 1, orange],
      [7, 11, 3, 1, orange],
    ],
    "A penguin",
  ),
  programming: icon(
    [
      [0, 2, 12, 9, frame],
      [1, 3, 10, 7, screen],
      [2, 4, 1, 1, green],
      [3, 5, 1, 1, green],
      [2, 6, 1, 1, green],
      [5, 6, 4, 1, dimGreen],
      [2, 8, 2, 1, green],
    ],
    "A terminal window",
  ),
  ai: icon(
    [
      [3, 3, 6, 6, "#4b5a78"],
      [5, 5, 2, 2, "#9fb3d9"],
      [4, 1, 1, 2, steel],
      [7, 1, 1, 2, steel],
      [4, 9, 1, 2, steel],
      [7, 9, 1, 2, steel],
      [1, 4, 2, 1, steel],
      [1, 7, 2, 1, steel],
      [9, 4, 2, 1, steel],
      [9, 7, 2, 1, steel],
    ],
    "A chip",
  ),
  automation: icon(
    [
      [3, 2, 6, 8, steel],
      [2, 3, 8, 6, steel],
      [5, 1, 2, 1, steel],
      [5, 10, 2, 1, steel],
      [1, 5, 1, 2, steel],
      [10, 5, 1, 2, steel],
      [5, 5, 2, 2, steelDark],
    ],
    "A gear",
  ),
  tools: icon(
    [
      [2, 2, 7, 3, steelDark],
      [8, 3, 2, 1, steelDark],
      [5, 5, 2, 6, wood],
    ],
    "A hammer",
  ),
  learning: icon(
    [
      [2, 1, 8, 10, "#3d6fb0"],
      [2, 1, 1, 10, "#2c548a"],
      [3, 10, 7, 1, white],
      [4, 3, 4, 1, white],
    ],
    "A book",
  ),
  guitar: icon(
    [
      [5, 0, 2, 2, neck],
      [5, 2, 2, 4, neck],
      [4, 5, 4, 1, guitar],
      [3, 6, 6, 5, guitar],
      [4, 11, 4, 1, guitar],
      [5, 7, 2, 2, ink],
    ],
    "A guitar",
  ),
};
