"use client";

import { useEffect, useRef } from "react";
import { meow } from "@/lib/sound";
import { Pixel, type Rect } from "./Pixel";

// A small gray pixel cat that lives on the page. It walks along whatever it's
// standing on (the bottom of the screen to start with), stops now and then, and can
// be picked up and dropped: it falls until its paws cross the top edge of something,
// and then that thing is its floor. If the floor goes away (you change pages), it
// falls again. With reduced motion it never walks on its own, but you can still move it.
// Picking it up gets you one of five meows.

const W = 64;
const H = 40;
const WALK_SPEED = 35; // px/s
const GRAVITY = 2400; // px/s²

type State = "walk" | "sit" | "held" | "fall";

// 16×10 sprite, drawn at 4× scale. Two leg frames alternate while walking.
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

export function Cat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sprite = el.firstElementChild as HTMLElement;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = innerWidth * 0.3;
    let y = innerHeight - H;
    let vy = 0;
    let dir = 1;
    let state: State = "walk";
    let surface: Element | null = null; // null means the bottom of the screen
    let restUntil = 0;
    let grab = { dx: 0, dy: 0 };
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
      setState("fall");
    }

    // The first thing under the cat whose top edge the paws crossed this frame.
    // null is the bottom of the screen; undefined means keep falling.
    function landing(cx: number, prevBottom: number, bottom: number) {
      if (bottom >= innerHeight) return null;
      for (const hit of document.elementsFromPoint(cx, bottom)) {
        if (el!.contains(hit) || hit === document.documentElement || hit === document.body) continue;
        const target = (hit instanceof SVGElement && hit.ownerSVGElement) || hit;
        const top = target.getBoundingClientRect().top;
        if (top >= prevBottom - 1 && top <= bottom) return target;
      }
      return undefined;
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (state === "fall") {
        const prevBottom = y + H;
        vy += GRAVITY * dt;
        y += vy * dt;
        const hit = landing(x + W / 2, prevBottom, y + H);
        if (hit !== undefined) {
          surface = hit;
          sit(now, 1200);
        }
      } else if (state !== "held") {
        const rect = surface?.getBoundingClientRect();
        if (surface && (!surface.isConnected || !rect || rect.width === 0)) {
          surface = null;
          fall();
        } else {
          const top = rect ? rect.top : innerHeight;
          const min = rect ? rect.left : 0;
          const max = (rect ? rect.right : innerWidth) - W;
          y = top - H;

          if (max <= min) {
            x = (min + max) / 2;
          } else {
            if (state === "walk") {
              x += dir * WALK_SPEED * dt;
              if (x <= min) dir = 1;
              if (x >= max) dir = -1;
              // Every eight seconds or so, stop for a bit.
              if (Math.random() < dt / 8) sit(now, 2000 + Math.random() * 3000);
            } else if (now > restUntil) {
              setState("walk");
            }
            x = clamp(x, min, max);
          }
        }
      }

      el!.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      sprite.style.transform = `scaleX(${dir})`;
      el!.style.visibility = "visible";
      frame = requestAnimationFrame(tick);
    }

    function onDown(e: PointerEvent) {
      e.preventDefault();
      el!.setPointerCapture(e.pointerId);
      grab = { dx: e.clientX - x, dy: e.clientY - y };
      surface = null;
      setState("held");
      meow();
    }

    function onMove(e: PointerEvent) {
      if (state !== "held") return;
      const nx = clamp(e.clientX - grab.dx, 0, innerWidth - W);
      if (nx !== x) dir = nx > x ? 1 : -1;
      x = nx;
      y = clamp(e.clientY - grab.dy, 0, innerHeight - H);
    }

    function onUp() {
      if (state === "held") fall();
    }

    if (still) sit(last, 0);
    else setState("walk");
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      title="pick me up"
      className="cat fixed top-0 left-0 z-40 h-10 w-16 cursor-grab touch-none select-none data-[state=held]:cursor-grabbing"
      style={{ visibility: "hidden" }}
    >
      <div className="relative size-full">
        <Pixel width={16} height={10} rects={body} className="absolute inset-0 size-full" />
        <Pixel width={16} height={10} rects={legsApart} className="cat-frame-a absolute inset-0 size-full" />
        <Pixel width={16} height={10} rects={legsTogether} className="cat-frame-b absolute inset-0 size-full" />
      </div>
    </div>
  );
}
