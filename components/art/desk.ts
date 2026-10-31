import type { Rect } from "../Pixel";

// The home page picture: my desk. Monitor with a terminal, a lamp, keyboard and
// coffee, and the guitar leaning on the right. The cat that sleeps on it is drawn
// separately (sleepingCat, below) so it can be picked up: see components/Desk.tsx.
// The monitor (cat-home) and the desk and keyboard (cat-bed) are where it will
// curl up again if you put it back (see lib/surfaces.ts). The lamp and the mug are
// tagged lamp-art and mug-art, and the screen, the terminal on it
// and the monitor's stand screen-art, so it falls straight past them.

const ink = "#2a2a2a";
const frame = "#4f4f4f";
const frameHi = "#6a6a6a";
// The terminal is in gruvbox, light or dark to match the page (globals.css).
const screen = "var(--term-bg)";
const prompt = "var(--term-prompt)";
const text = "var(--term-text)";
const text2 = "var(--term-text-2)";
const cursor = "var(--term-cursor)";
const deskHi = "#b88a5f";
const deskTop = "#a77b52";
const deskFront = "#8a6240";
const deskDark = "#6b4a2f";
const cat = "var(--cat)";
const catDark = "var(--cat-dark)";
const mug = "var(--mug)";
const mugStripe = "#c9503c";
const steam = "var(--steam)";
const guitar = "#c8873a";
const guitarDark = "#9a6226";
const neck = "#5a3a22";
const peg = "#dddddd";
const keyboard = "var(--keyboard)";
const key = "var(--key)";
const lamp = "#3c3c3c";
const bulb = "var(--bulb)";
// The lamp's light, falling on the desk. Drawn translucent over everything behind
// it, with how strong it is set by the theme in globals.css.
const light = "var(--lamp-light)";

const rects: Rect[] = [
  // floor
  [0, 45, 96, 1, "var(--rule)"],

  // desk
  [4, 30, 72, 1, deskHi, "cat-bed"],
  [4, 31, 72, 1, deskTop],
  [4, 32, 72, 2, deskFront],
  [7, 34, 3, 11, deskDark],
  [70, 34, 3, 11, deskDark],

  // lamp
  [7, 28, 7, 2, lamp, "lamp-art"],
  [10, 19, 1, 9, lamp, "lamp-art"],
  [11, 18, 1, 1, lamp, "lamp-art"],
  [12, 17, 1, 1, lamp, "lamp-art"],
  [13, 16, 1, 1, lamp, "lamp-art"],
  [13, 12, 6, 1, lamp, "lamp-art"],
  [12, 13, 8, 3, lamp, "lamp-art"],
  [14, 16, 4, 1, bulb, "lamp-art"],
  // its light: a cone widening down to the desk, a brighter core inside it, and a
  // pool on the desktop (the monitor, drawn after, sits in front of the edge of it)
  [13, 17, 6, 2, light, "lamp-light"],
  [12, 19, 8, 3, light, "lamp-light"],
  [11, 22, 10, 3, light, "lamp-light"],
  [10, 25, 12, 3, light, "lamp-light"],
  [9, 28, 14, 2, light, "lamp-light"],
  [5, 30, 24, 2, light, "lamp-light"],
  [7, 32, 18, 2, light, "lamp-light"],
  [14, 17, 4, 3, light, "lamp-light lamp-core"],
  [13, 20, 6, 4, light, "lamp-light lamp-core"],
  [12, 24, 8, 4, light, "lamp-light lamp-core"],
  [11, 28, 10, 2, light, "lamp-light lamp-core"],
  [9, 30, 14, 2, light, "lamp-light lamp-core"],

  // monitor
  [21, 8, 26, 18, frame, "cat-home"],
  [21, 8, 26, 1, frameHi],
  [23, 10, 22, 14, screen, "screen-art"],
  [32, 26, 4, 3, frame, "screen-art"],
  [28, 29, 12, 1, frame, "screen-art"],

  // terminal: three prompts and a blinking cursor
  [25, 12, 1, 1, prompt, "screen-art"],
  [26, 13, 1, 1, prompt, "screen-art"],
  [25, 14, 1, 1, prompt, "screen-art"],
  [28, 13, 9, 1, text, "screen-art"],
  [25, 16, 1, 1, prompt, "screen-art"],
  [26, 17, 1, 1, prompt, "screen-art"],
  [25, 18, 1, 1, prompt, "screen-art"],
  [28, 17, 12, 1, text2, "screen-art"],
  [25, 20, 1, 1, prompt, "screen-art"],
  [26, 21, 1, 1, prompt, "screen-art"],
  [25, 22, 1, 1, prompt, "screen-art"],
  [28, 20, 2, 3, cursor, "blink"],

  // keyboard
  [48, 28, 16, 2, keyboard, "cat-bed"],
  ...Array.from({ length: 8 }, (_, i) => [49 + i * 2, 28, 1, 1, key] as const),

  // coffee
  [66, 25, 5, 5, mug, "mug-art"],
  [66, 27, 5, 1, mugStripe, "mug-art"],
  [71, 26, 1, 1, mug, "mug-art"],
  [72, 26, 1, 3, mug, "mug-art"],
  [71, 28, 1, 1, mug, "mug-art"],
  // steam, rising off the coffee (animated in globals.css)
  [67, 22, 1, 2, steam, "steam steam-1"],
  [69, 21, 1, 2, steam, "steam steam-2"],
  [68, 22, 1, 1, steam, "steam steam-3"],

  // guitar
  [83, 3, 4, 5, neck, "guitar-art"],
  [82, 4, 1, 1, peg, "guitar-art"],
  [87, 4, 1, 1, peg, "guitar-art"],
  [82, 6, 1, 1, peg, "guitar-art"],
  [87, 6, 1, 1, peg, "guitar-art"],
  [84, 8, 2, 19, neck, "guitar-art"],
  [81, 27, 8, 1, guitar, "guitar-art"],
  [80, 28, 10, 3, guitar, "guitar-art"],
  [89, 28, 1, 3, guitarDark, "guitar-art"],
  [81, 31, 8, 2, guitar, "guitar-art"],
  [80, 33, 10, 1, guitar, "guitar-art"],
  [79, 34, 12, 10, guitar, "guitar-art"],
  [90, 34, 1, 10, guitarDark, "guitar-art"],
  [80, 44, 10, 1, guitar, "guitar-art"],
  [83, 29, 4, 3, ink, "guitar-art"],
  [82, 38, 6, 1, guitarDark, "guitar-art"],
];

// The z's sit above the top of the drawing above, so everything moves down a few
// rows to make room for them.
const HEADROOM = 6;

export const desk = {
  width: 96,
  height: 46 + HEADROOM,
  rects: rects.map(([x, y, w, h, fill, cls]) => [x, y + HEADROOM, w, h, fill, cls] as const),
  alt: "Pixel art of my desk: a monitor with a terminal open, a lamp, a keyboard, a mug of coffee, and a guitar leaning beside the desk.",
};

// The guitar's bounding box in the drawing, for the button that strums it.
export const guitarBox = { x: 79, y: 3 + HEADROOM, w: 12, h: 42 };

// The lamp, shade to base, for the button that switches it (and the theme).
export const lampBox = { x: 7, y: 12 + HEADROOM, w: 13, h: 18 };

// The cat, asleep, on its own 26×20 grid. Row 13 is whatever it's lying on.
const sleeping: Rect[] = [
  [4, 8, 10, 1, cat],
  [3, 9, 12, 4, cat],
  [4, 12, 10, 1, catDark],
  [13, 7, 5, 5, cat],
  [13, 6, 1, 1, cat],
  [17, 6, 1, 1, cat],
  [15, 9, 2, 1, ink],
  // breathing: an extra row on its back that comes and goes, and two small z's
  // floating up from its head (animated in globals.css)
  [5, 7, 8, 1, cat, "breathe"],
  [19, 3, 2, 1, "var(--pixel-ink)", "snore snore-1"],
  [20, 4, 1, 1, "var(--pixel-ink)", "snore snore-1"],
  [20, 5, 2, 1, "var(--pixel-ink)", "snore snore-1"],
  [23, 0, 2, 1, "var(--pixel-ink)", "snore snore-2"],
  [24, 1, 1, 1, "var(--pixel-ink)", "snore snore-2"],
  [24, 2, 2, 1, "var(--pixel-ink)", "snore snore-2"],
];

export const sleepingCat = {
  width: 26,
  height: 20,
  floor: 13,
  middle: 10, // the middle of its body, across
  // On the monitor, with its tail hanging down the front of it.
  home: [...sleeping, [1, 11, 3, 1, cat], [1, 12, 1, 7, cat], [1, 19, 1, 1, catDark]] as Rect[],
  homeAt: { x: 21, y: 1 }, // where the grid's corner sits in the desk drawing
  // Anywhere else, with its tail curled round in front.
  curled: [...sleeping, [1, 11, 3, 1, cat], [0, 12, 2, 1, cat], [0, 12, 1, 1, catDark]] as Rect[],
};
