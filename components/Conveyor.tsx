"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cardboard } from "@/lib/sound";
import type { Rect } from "./Pixel";
import {
  beltLeft,
  beltRight,
  cartonRects,
  cartons,
  contents,
  conveyorArch,
  conveyorBase,
  conveyorHeight,
  conveyorItems,
  conveyorLoop,
  conveyorWidth,
  type Carton,
} from "./art/conveyor";

// The conveyor under the KNAPP entry. The cartons, the tote and the marks on the belt
// slide along one pixel at a time and loop; they're clipped to the belt so they
// appear and disappear at its ends, and pass behind the scanner. The motion is the
// .conveyor-move rule in globals.css, and stops with reduced motion. Put the cat on
// the belt or on a box and it rides along to the end (lib/surfaces.ts reads how far
// the data-belt layer has moved).
//
// Click a carton to open it and see what's inside; each time you open one it holds
// something different. An open carton closes again once it's gone off the end of
// the belt, so it comes round shut.

const rects = (list: readonly Rect[], dx = 0) =>
  list.map(([x, y, w, h, fill, cls], i) => (
    <rect key={`${dx}-${i}`} x={x + dx} y={y} width={w} height={h} fill={fill} className={cls} />
  ));

// How often to check whether an open carton has gone off the end, in ms.
const CHECK_EVERY = 250;

type State = { open: boolean; opened: number };

// What carton i holds the nth time it's opened. They start two apart so no two
// cartons hold the same thing at once.
const holding = (i: number, n: number) => contents[(i * 2 + n) % contents.length];

// Whether a carton is in the stretch past the end of the belt where nothing shows,
// with the moving layer slid `offset` units along.
function offstage({ x, w }: Carton, offset: number) {
  const at = (x + offset) % conveyorLoop;
  return at >= beltRight && at + w - conveyorLoop <= beltLeft;
}

export function Conveyor({ className }: { className?: string }) {
  const [state, setState] = useState<State[]>(() => cartons.map(() => ({ open: false, opened: 0 })));
  const belt = useRef<SVGGElement>(null);
  const anyOpen = state.some((s) => s.open);

  useEffect(() => {
    if (!anyOpen) return;
    const id = setInterval(() => {
      const layer = belt.current;
      if (!layer) return;
      const t = getComputedStyle(layer).transform;
      const offset = t === "none" ? 0 : Math.round(new DOMMatrix(t).e);
      setState((all) =>
        all.some((s, i) => s.open && offstage(cartons[i], offset))
          ? all.map((s, i) => (s.open && offstage(cartons[i], offset) ? { ...s, open: false } : s))
          : all,
      );
    }, CHECK_EVERY);
    return () => clearInterval(id);
  }, [anyOpen]);

  function toggle(i: number) {
    const open = !state[i].open;
    cardboard(open);
    setState((all) => all.map((s, j) => (j === i ? { open, opened: s.opened + (open ? 1 : 0) } : s)));
  }

  function onKey(e: KeyboardEvent, i: number) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    toggle(i);
  }

  // Each carton is drawn twice, a loop apart, like everything else on the belt. Only
  // the first one is in the tab order; clicking either works.
  const drawCarton = (c: Carton, i: number, dx: number) => {
    const { open, opened } = state[i];
    const inside = open ? holding(i, opened - 1) : null;
    const at = { x: c.x + dx, top: c.top };
    return (
      <g
        key={`${i}-${dx}`}
        className="carton"
        role={dx === 0 ? "button" : undefined}
        tabIndex={dx === 0 ? 0 : -1}
        aria-hidden={dx === 0 ? undefined : true}
        aria-label={inside ? `An open carton with ${inside.name} in it. Close it` : "Open the carton"}
        onClick={() => toggle(i)}
        onKeyDown={(e) => onKey(e, i)}
      >
        {inside ? (
          // Drawn behind the carton, so it rises up out of it.
          <g
            className="carton-item"
            style={{ "--rise": `${inside.h}px` } as CSSProperties}
            transform={`translate(${at.x + Math.floor((c.w - 1 - inside.w) / 2)} ${at.top + 1 - inside.h})`}
          >
            {rects(inside.rects)}
          </g>
        ) : null}
        {rects(cartonRects({ ...c, x: at.x }, open))}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${conveyorWidth} ${conveyorHeight}`}
      shapeRendering="crispEdges"
      role="group"
      aria-label="Pixel art of a conveyor belt carrying cardboard cartons and a blue tote through a barcode scanner."
      className={className}
    >
      <defs>
        <clipPath id="conveyor-belt">
          <rect x={beltLeft} y="0" width={beltRight - beltLeft} height={conveyorHeight} />
        </clipPath>
      </defs>
      {rects(conveyorBase)}
      <g clipPath="url(#conveyor-belt)">
        <g ref={belt} className="conveyor-move" data-belt="" data-loop={conveyorLoop}>
          {rects(conveyorItems)}
          {rects(conveyorItems, -conveyorLoop)}
          {cartons.map((c, i) => drawCarton(c, i, 0))}
          {cartons.map((c, i) => drawCarton(c, i, -conveyorLoop))}
        </g>
      </g>
      {rects(conveyorArch)}
    </svg>
  );
}
