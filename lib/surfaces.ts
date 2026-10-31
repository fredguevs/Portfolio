// What the cat (and anything else that falls) can stand on. Everything here is in
// viewport pixels and read fresh every frame, so a surface moves when the page
// scrolls or when the thing itself moves (the boxes on the conveyor).
//
// Surfaces are:
// - a line of text: each line of a paragraph or heading is its own ledge, as wide
//   as the words on it;
// - the pixel art: the top of whichever rectangle of the drawing is highest under
//   the paws. Rects with a class are decorations (steam, z's) and are skipped,
//   unless the class starts with "cat-": cat-home and cat-bed are where the cat
//   falls asleep (the desk), and cat-belt carries whatever is on it (the conveyor);
// - other pictures and icons: the top of their box;
// - the bottom of the screen (null).
//
// Anything marked data-body (the cat, the things on the shelf) is not a surface.

export const GRAVITY = 2400; // px/s²

export type Span = { top: number; left: number; right: number; edge?: readonly [number, number] };

export type Surface = {
  el: Element;
  // What to fall through to fall off this surface: the whole drawing, or the whole
  // paragraph, so you don't land on the next row of the same thing.
  owner: Element;
  kind?: "home" | "bed";
  span(): Span | null;
  // Extra px this frame from a moving belt.
  drift?(): number;
};

// The first surface whose top the bottom edge crossed between prevBottom and bottom,
// at x = cx. null is the bottom of the screen; undefined means keep falling.
export function findSurface(cx: number, prevBottom: number, bottom: number, ignore: Element | null = null) {
  if (bottom >= innerHeight) return null;

  let best: { top: number; make: () => Surface } | undefined;
  const consider = (top: number, make: () => Surface) => {
    if (top >= prevBottom - 1 && top <= bottom && (!best || top < best.top)) best = { top, make };
  };

  const seen = new Set<Element>();
  for (const py of new Set([prevBottom, bottom])) {
    const hit = document
      .elementsFromPoint(cx, py)
      .find((e) => !e.closest("[data-body]") && e !== document.documentElement && e !== document.body);
    if (!hit) continue;
    const svg = hit instanceof SVGSVGElement ? hit : hit instanceof SVGElement ? hit.ownerSVGElement : null;
    const container = svg ?? hit;
    if (seen.has(container) || container === ignore) continue;
    seen.add(container);

    if (svg) scanDrawing(svg, cx, consider);
    else if (SOLID.has(hit.tagName)) consider(hit.getBoundingClientRect().top, () => boxSurface(hit));
    else scanText(hit, cx, ignore, consider);
  }
  return best?.make();
}

// Keeps something standing on its surface: moves it along with the surface, puts its
// feet on top, and returns the span it can walk along, or null if it's gone off the
// end (or the surface went away) and should fall.
export function follow(body: { x: number; y: number; surface: Surface | null; anchor: number }, w: number, h: number) {
  const span = body.surface ? body.surface.span() : { top: innerHeight, left: 0, right: innerWidth };
  if (!span) return null;
  const carry = span.left - body.anchor + (body.surface?.drift?.() ?? 0);
  body.anchor = span.left;
  // A jump this big is the conveyor looping round, not something carrying us.
  if (Math.abs(carry) > w) return null;
  body.x += carry;
  const cx = body.x + w / 2;
  const [lo, hi] = span.edge ?? [span.left, span.right];
  if (cx < Math.max(lo, span.left) || cx > Math.min(hi, span.right)) return null;
  body.y = span.top - h;
  return { span, carried: carry !== 0 };
}

// Things the cat can knock over, registered by whatever draws them (the shelf).
export type Knockable = { el: HTMLElement; knock(dir: number, ignore: Element | null): void };
export const knockables = new Set<Knockable>();

const SOLID = new Set(["IMG", "VIDEO", "CANVAS", "INPUT", "TEXTAREA", "SELECT", "IFRAME"]);

// Where the cat stands on a line of text, as a share of the line's height: the top of
// the line box is a little above the letters.
const TEXT_INSET = 0.18;

type Consider = (top: number, make: () => Surface) => void;

function scanDrawing(svg: SVGSVGElement, cx: number, consider: Consider) {
  const rects = [...svg.querySelectorAll("rect")].filter((r) => !r.closest("defs, clipPath"));
  if (rects.length === 0) {
    // An icon made of paths: just its box.
    consider(svg.getBoundingClientRect().top, () => boxSurface(svg));
    return;
  }
  for (const r of rects) {
    const cls = r.getAttribute("class");
    if (cls && !cls.startsWith("cat-")) continue;
    const b = r.getBoundingClientRect();
    if (cx < b.left || cx > b.right) continue;
    const edge = clipEdge(r);
    if (edge && (cx < edge[0] || cx > edge[1])) continue;
    consider(b.top, () => rectSurface(r));
  }
}

function rectSurface(r: SVGRectElement): Surface {
  const svg = r.ownerSVGElement!;
  const cls = r.getAttribute("class") ?? "";
  return {
    el: r,
    owner: svg,
    kind: cls.includes("cat-home") ? "home" : cls.includes("cat-bed") ? "bed" : undefined,
    span() {
      if (!r.isConnected) return null;
      const b = r.getBoundingClientRect();
      if (b.width === 0) return null;
      return { top: b.top, left: b.left, right: b.right, edge: clipEdge(r) };
    },
    drift: cls.includes("cat-belt") ? beltDrift(svg) : undefined,
  };
}

// The visible part of a rect inside a clipped group (the boxes on the conveyor only
// show on the belt), as [left, right], or undefined if it isn't clipped.
function clipEdge(r: SVGRectElement) {
  const id = r.closest("[clip-path]")?.getAttribute("clip-path")?.match(/#([^)]+)/)?.[1];
  const clip = id ? document.getElementById(id)?.querySelector("rect") : null;
  if (!clip) return undefined;
  const svg = r.ownerSVGElement!;
  const box = svg.getBoundingClientRect();
  const scale = box.width / svg.viewBox.baseVal.width;
  const x = clip.x.baseVal.value;
  return [box.left + x * scale, box.left + (x + clip.width.baseVal.value) * scale] as const;
}

// How far the belt's moving layer (marked data-belt) has slid since last time, in px.
// It loops every data-loop units of the drawing (or its whole width).
function beltDrift(svg: SVGSVGElement) {
  const layer = svg.querySelector("[data-belt]");
  const loop = Number(layer?.getAttribute("data-loop")) || svg.viewBox.baseVal.width;
  let last: number | null = null;
  return () => {
    if (!layer) return 0;
    const t = getComputedStyle(layer).transform;
    const offset = t === "none" ? 0 : new DOMMatrix(t).e;
    const moved = last === null ? 0 : (((offset - last) % loop) + loop) % loop;
    last = offset;
    return moved * (svg.getBoundingClientRect().width / svg.viewBox.baseVal.width);
  };
}

function boxSurface(el: Element): Surface {
  return {
    el,
    owner: el,
    span() {
      if (!el.isConnected) return null;
      const b = el.getBoundingClientRect();
      return b.width === 0 ? null : { top: b.top, left: b.left, right: b.right };
    },
  };
}

function scanText(root: Element, cx: number, ignore: Element | null, consider: Consider) {
  const range = document.createRange();
  for (const node of textNodes(root)) {
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (cx < r.left || cx > r.right) continue;
      const top = r.top + r.height * TEXT_INSET;
      const block = blockOf(node);
      if (block === ignore) continue;
      consider(top, () => lineSurface(block, r, top));
    }
  }
}

// One line of text in a block: as wide as all the words on that line.
function lineSurface(block: Element, hit: DOMRect, top: number): Surface {
  let left = hit.left;
  let right = hit.right;
  const mid = (hit.top + hit.bottom) / 2;
  const range = document.createRange();
  for (const node of textNodes(block)) {
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (Math.abs((r.top + r.bottom) / 2 - mid) > hit.height / 2) continue;
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    }
  }
  const b = block.getBoundingClientRect();
  const offset = { top: top - b.top, left: left - b.left, right: right - b.left };
  return {
    el: block,
    owner: block,
    span() {
      if (!block.isConnected) return null;
      const now = block.getBoundingClientRect();
      if (now.width === 0) return null;
      return { top: now.top + offset.top, left: now.left + offset.left, right: now.left + offset.right };
    },
  };
}

function* textNodes(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.textContent?.trim() && !n.parentElement?.closest("[data-body], svg")) yield n as Text;
  }
}

// The nearest ancestor that lays out as a block (a paragraph, a heading, a list item).
function blockOf(node: Node) {
  let el = node.parentElement!;
  while (el.parentElement && el.parentElement !== document.body) {
    const display = getComputedStyle(el).display;
    if (!display.startsWith("inline") && display !== "contents") break;
    el = el.parentElement;
  }
  return el;
}
