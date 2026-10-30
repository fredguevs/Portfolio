"use client";

import { useEffect, useRef } from "react";
import { catNap, onWake } from "@/lib/cat";
import { meow } from "@/lib/sound";
import { GRAVITY, findSurface, follow, knockables, type Knockable, type Surface } from "@/lib/surfaces";
import { Pixel, type Rect } from "./Pixel";

// The cat, awake. It starts asleep on the monitor on the home page (components/Desk.tsx);
// pick it up there and it's this. Drop it and it falls until its paws cross the top
// of something, a line of text, a heading, the pixel art, the bottom of the screen
// (lib/surfaces.ts), and walks along that, stopping now and then. Put it back on the
// desk and it goes to sleep there again.
//
// While it's awake it comes with you to other pages: when the page changes under it,
// it falls onto whatever is there now. On the conveyor it sits and rides to the end;
// if it walks into something it can knock over (the things on the projects shelf),
// it stops, looks at it, and swats it off.
//
// With reduced motion it never walks on its own, but you can still move it.
// Picking it up gets you one of five meows.

const W = 64;
const H = 40;
const WALK_SPEED = 35; // px/s

type State = "walk" | "sit" | "held" | "fall" | "swat" | "asleep";

// 16×10 sprite, drawn at 4× scale. Two leg frames alternate while walking, and a
// third has a front paw up, for swatting.
const cat = "var(--cat)";
const shade = "var(--cat-dark)";
const body: Rect[] = [
  [12, 0, 1, 1, cat],
  [15, 0, 1, 1, cat],
  [11, 1, 5, 3, cat],
  [14, 2, 1, 1, "#111"],
  [1, 1, 1, 3, cat],
  [2, 4, 1, 1, cat],
  [4, 4, 11, 1, cat],
  [3, 5, 12, 2, cat],
  [4, 7, 10, 1, shade],
];
const legsApart: Rect[] = [
  [4, 8, 1, 2, cat],
  [7, 8, 1, 2, cat],
  [11, 8, 1, 2, cat],
  [14, 8, 1, 2, cat],
];
const legsTogether: Rect[] = [
  [5, 8, 1, 2, cat],
  [6, 8, 1, 2, cat],
  [12, 8, 1, 2, cat],
  [13, 8, 1, 2, cat],
];
const legsSwat: Rect[] = [
  [5, 8, 1, 2, cat],
  [6, 8, 1, 2, cat],
  [12, 8, 1, 2, cat],
  [15, 4, 1, 2, cat],
];

export function Cat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sprite = el.firstElementChild as HTMLElement;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Where it is, and what it's standing on (null is the bottom of the screen).
    const me = { x: 0, y: 0, surface: null as Surface | null, anchor: 0 };
    let vy = 0;
    let dir = 1;
    let state: State = "asleep";
    let restUntil = 0;
    let rodeAt = -Infinity; // the last time the surface carried it along
    let grab = { dx: 0, dy: 0 };
    // Something it's about to knock over: it stares until `at`, then swats.
    let swat: { target: Knockable; at: number; swung: boolean } | null = null;
    let last = performance.now();
    let frame = 0;

    const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

    function setState(next: State) {
      state = next;
      el!.dataset.state = next;
    }

    function sit(now: number, ms: number) {
      setState("sit");
      restUntil = still ? Infinity : now + ms;
    }

    function fall() {
      vy = 0;
      me.surface = null;
      swat = null;
      setState("fall");
    }

    // Landed on the desk: back to sleep, drawn by the desk from here on.
    function sleepOn(hit: Surface) {
      if (hit.kind === "home") {
        catNap.set({ spot: "home" });
      } else {
        const rect = hit.el as SVGRectElement;
        const svg = hit.owner as SVGSVGElement;
        const box = svg.getBoundingClientRect();
        const scale = box.width / svg.viewBox.baseVal.width;
        const left = rect.x.baseVal.value;
        const x = clamp((me.x + W / 2 - box.left) / scale, left, left + rect.width.baseVal.value);
        catNap.set({ spot: "bed", x, y: rect.y.baseVal.value });
      }
      setState("asleep");
    }

    // Walking into something it can knock over, on the same level as its paws.
    function spotTarget() {
      const cx = me.x + W / 2;
      const front = dir > 0 ? me.x + W : me.x;
      for (const k of knockables) {
        const r = k.el.getBoundingClientRect();
        if (Math.abs(r.bottom - (me.y + H)) > 4) continue;
        if (r.right < Math.min(cx, front) || r.left > Math.max(cx, front)) continue;
        return k;
      }
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (state === "fall") {
        const prevBottom = me.y + H;
        vy += GRAVITY * dt;
        me.y += vy * dt;
        const hit = findSurface(me.x + W / 2, prevBottom, me.y + H);
        if (hit?.kind) {
          sleepOn(hit);
        } else if (hit !== undefined) {
          me.surface = hit;
          me.anchor = hit ? hit.span()!.left : 0;
          me.y = (hit ? hit.span()!.top : innerHeight) - H;
          sit(now, 1200);
        }
      } else if (state !== "held" && state !== "asleep") {
        const footing = follow(me, W, H);
        if (!footing) {
          fall();
        } else {
          if (footing.carried) rodeAt = now;
          // On the conveyor it sits still and enjoys the ride.
          const riding = now - rodeAt < 500;
          const min = footing.span.left;
          const max = footing.span.right - W;

          if (max <= min) {
            // Not room to walk: it just sits, in the middle.
            me.x = (min + max) / 2;
            if (state === "walk") sit(now, 2000 + Math.random() * 3000);
          } else if (state === "walk") {
            me.x += dir * WALK_SPEED * dt;
            if (me.x <= min) dir = 1;
            if (me.x >= max) dir = -1;
            const target = riding ? undefined : spotTarget();
            if (riding) sit(now, 0);
            else if (target) {
              swat = { target, at: now + 600, swung: false };
              sit(now, Infinity);
            }
            // Every eight seconds or so, stop for a bit.
            else if (Math.random() < dt / 8) sit(now, 2000 + Math.random() * 3000);
          } else if (state === "sit" && !swat && !riding && now > restUntil) {
            setState("walk");
          }

          if (swat && now >= swat.at) {
            if (!swat.swung) {
              setState("swat");
              Object.assign(swat, { swung: true, at: now + 250 });
            } else {
              swat.target.knock(dir, me.surface?.owner ?? null);
              swat = null;
              // And then it sits and looks pleased with itself.
              sit(now, 2500 + Math.random() * 2000);
            }
          }

          // Riding, it's the belt that decides when it gets to the end.
          if (!riding) me.x = clamp(me.x, min, Math.max(min, max));
        }
      }

      el!.style.transform = `translate3d(${Math.round(me.x)}px, ${Math.round(me.y)}px, 0)`;
      sprite.style.transform = `scaleX(${dir})`;
      el!.style.visibility = state === "asleep" ? "hidden" : "visible";
      frame = requestAnimationFrame(tick);
    }

    function pickUp(px: number, py: number) {
      grab = { dx: px - me.x, dy: py - me.y };
      me.surface = null;
      swat = null;
      setState("held");
      meow();
    }

    function onDown(e: PointerEvent) {
      e.preventDefault();
      pickUp(e.clientX, e.clientY);
    }

    function onMove(e: PointerEvent) {
      if (state !== "held") return;
      const nx = clamp(e.clientX - grab.dx, 0, innerWidth - W);
      if (nx !== me.x) dir = nx > me.x ? 1 : -1;
      me.x = nx;
      me.y = clamp(e.clientY - grab.dy, 0, innerHeight - H);
    }

    function onUp() {
      if (state === "held") fall();
    }

    // The page reflowed, so the line it was standing on may have moved.
    function onResize() {
      if (state === "walk" || state === "sit" || state === "swat") fall();
    }

    const offWake = onWake((px, py) => {
      catNap.set(null);
      me.x = clamp(px - W / 2, 0, innerWidth - W);
      me.y = clamp(py - H / 2, 0, innerHeight - H);
      pickUp(px, py);
    });

    if (!catNap.get()) fall();
    else setState("asleep");
    el.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    addEventListener("resize", onResize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      offWake();
      el.removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      title="pick me up"
      data-body=""
      className="cat fixed top-0 left-0 z-40 h-10 w-16 cursor-grab touch-none select-none data-[state=held]:cursor-grabbing"
      style={{ visibility: "hidden" }}
    >
      <div className="relative size-full">
        <Pixel width={16} height={10} rects={body} className="absolute inset-0 size-full" />
        <Pixel width={16} height={10} rects={legsApart} className="cat-frame-a absolute inset-0 size-full" />
        <Pixel width={16} height={10} rects={legsTogether} className="cat-frame-b absolute inset-0 size-full" />
        <Pixel width={16} height={10} rects={legsSwat} className="cat-frame-swat absolute inset-0 size-full" />
      </div>
    </div>
  );
}
