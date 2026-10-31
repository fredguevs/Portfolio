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
const apple = "#7cc142";
const pad = "#b9b9c4";

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
  singing: icon(
    [
      [5, 0, 2, 1, steel],
      [4, 1, 4, 4, steel],
      [4, 2, 4, 1, steelDark],
      [4, 4, 4, 1, steelDark],
      [4, 5, 4, 1, ink],
      [5, 6, 2, 5, ink],
      [5, 11, 2, 1, steelDark],
    ],
    "A microphone",
  ),
  piano: icon(
    [
      [0, 2, 12, 8, ink],
      [1, 3, 10, 6, white],
      [2, 3, 2, 3, ink],
      [5, 3, 2, 3, ink],
      [8, 3, 2, 3, ink],
      [3, 6, 1, 3, ink],
      [6, 6, 1, 3, ink],
      [9, 6, 1, 3, ink],
    ],
    "Piano keys",
  ),
  // Apple Records.
  beatles: icon(
    [
      [6, 0, 1, 2, neck],
      [7, 1, 2, 1, dimGreen],
      [2, 2, 3, 1, apple],
      [7, 2, 3, 1, apple],
      [1, 3, 10, 6, apple],
      [2, 9, 8, 1, apple],
      [3, 10, 2, 1, apple],
      [7, 10, 2, 1, apple],
      [3, 4, 1, 2, "#b5e27e"],
    ],
    "A green apple",
  ),
  gaming: icon(
    [
      [2, 3, 8, 1, pad],
      [1, 4, 10, 4, pad],
      [0, 5, 1, 3, pad],
      [11, 5, 1, 3, pad],
      [1, 8, 3, 2, pad],
      [8, 8, 3, 2, pad],
      [3, 4, 1, 3, ink],
      [2, 5, 3, 1, ink],
      [9, 4, 1, 1, "#4a6fc8"],
      [8, 5, 1, 1, "#c84a4a"],
      [5, 6, 2, 1, steelDark],
    ],
    "A game controller",
  ),
  cooking: icon(
    [
      [3, 0, 1, 2, "var(--steam)"],
      [5, 1, 1, 2, "var(--steam)"],
      [1, 4, 6, 1, ink],
      [0, 5, 8, 4, ink],
      [1, 9, 6, 1, ink],
      [8, 6, 4, 1, neck],
      [2, 5, 4, 3, white],
      [3, 6, 2, 1, orange],
    ],
    "An egg in a frying pan",
  ),
};
