"use client";

import { useEffect, useRef } from "react";
import { clack } from "@/lib/sound";
import { GRAVITY, findSurface, follow, knockables, type Surface } from "@/lib/surfaces";
import { art } from "./art";
import { shelfThings } from "./art/spots";
import { ArtSlot } from "./ArtSlot";
import { Pixel } from "./Pixel";

// The shelf on the projects page. Each thing on it can be picked up and dropped
// anywhere, and the cat (components/Cat.tsx) knocks them off whatever they're on
// when it walks into them. Put them back on the shelf and it'll do it again.
// They stay where you left them until you leave the page.

type Thing = {
  el: HTMLDivElement;
  state: "shelf" | "fall" | "rest" | "held";
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  spin: number;
  angle: number;
  surface: Surface | null;
  anchor: number;
  ignore: Element | null; // what it was knocked off, to fall through
  grab: { dx: number; dy: number };
};

const { width, height } = art.shelf;

export function Shelf({ className }: { className?: string }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const things: Thing[] = refs.current.map((el) => ({
      el: el!,
      state: "shelf",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      vx: 0,
      vy: 0,
      spin: 0,
      angle: 0,
      surface: null,
      anchor: 0,
      ignore: null,
      grab: { dx: 0, dy: 0 },
    }));
    let held: Thing | null = null;
    let last = performance.now();
    let frame = 0;

    // Off the shelf's layout and into the page, where it can fall.
    function loosen(t: Thing) {
      if (t.state !== "shelf") return;
      const r = t.el.getBoundingClientRect();
      Object.assign(t, { x: r.left, y: r.top, w: r.width, h: r.height });
      Object.assign(t.el.style, { position: "fixed", left: "0", top: "0", width: `${r.width}px` });
    }

    function drop(t: Thing, ignore: Element | null = null) {
      Object.assign(t, { state: "fall", vy: 0, vx: 0, spin: 0, ignore });
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      for (const t of things) {
        if (t.state === "fall") {
          const prevBottom = t.y + t.h;
          t.vy += GRAVITY * dt;
          t.x = Math.min(Math.max(t.x + t.vx * dt, 0), innerWidth - t.w);
          t.y += t.vy * dt;
          t.angle += t.spin * dt;
          const hit = findSurface(t.x + t.w / 2, prevBottom, t.y + t.h, t.ignore);
          if (hit !== undefined) {
            const top = hit ? hit.span()!.top : innerHeight;
            t.y = top - t.h;
            clack(Math.min(t.vy / 1400, 1));
            if (t.vy > 500) {
              // A little bounce.
              t.vy *= -0.3;
              t.vx *= 0.5;
            } else {
              Object.assign(t, { state: "rest", surface: hit, anchor: hit?.span()!.left ?? 0, angle: 0 });
            }
          }
        } else if (t.state === "rest") {
          if (!follow(t, t.w, t.h)) drop(t);
        }

        if (t.state !== "shelf") {
          // Turns in eighths of a circle, like a sprite would.
          const angle = Math.round(t.angle / 45) * 45;
          t.el.style.transform = `translate3d(${Math.round(t.x)}px, ${Math.round(t.y)}px, 0) rotate(${angle}deg)`;
        }
      }
      frame = requestAnimationFrame(tick);
    }

    const knocks = things.map((t) => ({
      el: t.el,
      knock(dir: number, ignore: Element | null) {
        if (t.state === "held" || t.state === "fall") return;
        loosen(t);
        drop(t, ignore);
        Object.assign(t, { vx: dir * (60 + Math.random() * 80), vy: -380, spin: dir * 600 });
      },
    }));
    for (const k of knocks) knockables.add(k);

    const downs = things.map((t) => (e: PointerEvent) => {
      e.preventDefault();
      loosen(t);
      t.grab = { dx: e.clientX - t.x, dy: e.clientY - t.y };
      t.state = "held";
      t.angle = 0;
      held = t;
      t.el.dataset.held = "";
    });

    function onMove(e: PointerEvent) {
      if (!held) return;
      held.x = Math.min(Math.max(e.clientX - held.grab.dx, 0), innerWidth - held.w);
      held.y = Math.min(Math.max(e.clientY - held.grab.dy, 0), innerHeight - held.h);
    }

    function onUp() {
      if (!held) return;
      delete held.el.dataset.held;
      drop(held);
      held = null;
    }

    // The page reflowed, so whatever they're standing on may have moved: let them settle.
    function onResize() {
      for (const t of things) if (t.state === "rest") drop(t);
    }

    things.forEach((t, i) => t.el.addEventListener("pointerdown", downs[i]));
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    addEventListener("resize", onResize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      for (const k of knocks) knockables.delete(k);
      things.forEach((t, i) => t.el.removeEventListener("pointerdown", downs[i]));
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div role="img" aria-label={art.shelf.alt} className={`relative ${className ?? ""}`}>
      <ArtSlot name="shelf" decorative className="block w-full" />
      {shelfThings.map((thing, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-body=""
          title={thing.name.toLowerCase()}
          className="shelf-thing absolute z-30 cursor-grab touch-none select-none data-held:cursor-grabbing"
          style={{
            left: `${(thing.x / width) * 100}%`,
            top: `${(thing.y / height) * 100}%`,
            width: `${(thing.width / width) * 100}%`,
          }}
        >
          <Pixel width={thing.width} height={thing.height} rects={thing.rects} className="block w-full" />
        </div>
      ))}
    </div>
  );
}
