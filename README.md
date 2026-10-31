# Portfolio

My personal site: who I am, what I've built, and where I work. It's built with Next.js and exported as plain static HTML.

Every picture on the site is pixel art drawn in code, and every sound is generated in the browser. There are no image or audio files besides the favicon and my resume.

## Things to try

- **The cat.** It's asleep on the monitor on the home page. Pick it up and drop it anywhere. It falls until it lands on something, like a line of text, a heading or a drawing, and then it walks along it. It follows you to other pages. Put it back on the desk and it goes back to sleep.
- **The desk.** Click the guitar to strum a chord, or the lamp to switch between light and dark mode.
- **The shelf** (projects page). Everything on it can be picked up and thrown. If the cat walks into something on the shelf, it stops, stares, and knocks it off.
- **The conveyor** (experience page). It's a nod to my job in warehouse automation. Click a carton to open it. Drop the cat on the belt and it rides to the end.
- **The block M** (experience page). Click it.

If your system is set to reduced motion, the conveyor stops and the cat only moves when you move it.

## How it works

| Piece | Where | What it does |
| --- | --- | --- |
| Pixel art | `components/Pixel.tsx`, `components/art/` | Each drawing is a list of `[x, y, w, h, color]` rectangles on a small grid, rendered as an SVG with `shape-rendering: crispEdges` so it stays sharp at any size. |
| Physics | `lib/surfaces.ts` | Finds what's under a falling object with `document.elementsFromPoint`, then works out the exact top edge: a line of text (via `Range.getClientRects`), the highest rectangle in a drawing, or the box of an image. Positions are re-read every frame, so surfaces move when you scroll. |
| The cat | `components/Cat.tsx`, `lib/cat.ts` | A small state machine (`asleep`, `held`, `fall`, `sit`, `walk`, `swat`) driven by `requestAnimationFrame`. Whether the cat is asleep is stored outside React, so it survives page changes. |
| Sound | `lib/sound.ts` | Web Audio synthesis. The meow is a sawtooth wave pushed through moving band-pass filters. The guitar uses Karplus-Strong string synthesis. The lamp switch and the cartons are short bursts of filtered noise. |
| Theme | `lib/theme.ts`, `app/layout.tsx` | A small inline script sets the `dark` class before the page is first drawn, so there's no flash of the wrong theme. The header toggle and the desk lamp share the same small store through `useSyncExternalStore`. |
| Content | `content/` | All the text about me: projects, jobs, links. The pages are generated from these files. |

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4. There are no other runtime dependencies.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # static site in out/
npm start          # serve out/ locally
```

## Editing

- **Projects, jobs, skills, links:** edit the files in `content/`. Each one has a comment at the top explaining its format.
- **Swapping a drawing for an image:** put a PNG in `public/art/` and set `src` on that drawing's entry in `components/art/index.ts`.
- **Resume:** replace `public/resume.pdf`.

## Deploying

`npm run build` writes a fully static site to `out/`. You can put it on any static host: GitHub Pages, Netlify, Vercel, S3 + CloudFront.
