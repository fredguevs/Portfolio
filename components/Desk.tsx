"use client";

import { useSyncExternalStore } from "react";
import { catNap, wakeCat } from "@/lib/cat";
import { ArtSlot } from "./ArtSlot";
import { desk, guitarBox, lampBox, sleepingCat } from "./art/desk";
import { GuitarButton } from "./GuitarButton";
import { LampButton } from "./LampButton";
import { Pixel, type Rect } from "./Pixel";

// The desk on the home page, with the cat asleep on it while it's there. Grab the
// cat and it wakes up and becomes components/Cat.tsx; put it back on the monitor or
// the desk and it goes back to sleep here. Click the guitar to strum it, or
// the lamp to switch between light and dark.

// Where you can grab it: round its body and head, not the empty space round the z's.
const handle: Rect = [0, 5, 19, 8, "transparent", "nap-handle"];

// Where a box in the drawing sits over it, as percentages, for the buttons.
function place(box: { x: number; y: number; w: number; h: number }) {
  return {
    left: `${(box.x / desk.width) * 100}%`,
    top: `${(box.y / desk.height) * 100}%`,
    width: `${(box.w / desk.width) * 100}%`,
    height: `${(box.h / desk.height) * 100}%`,
  };
}

export function Desk({ className }: { className?: string }) {
  const nap = useSyncExternalStore(catNap.subscribe, catNap.get, catNap.get);

  const at =
    nap?.spot === "home"
      ? sleepingCat.homeAt
      : nap
        ? { x: nap.x - sleepingCat.middle, y: nap.y - sleepingCat.floor }
        : null;

  return (
    <div className={`desk relative ${className ?? ""}`}>
      <ArtSlot name="desk" className="block w-full" />
      <LampButton style={place(lampBox)} />
      <GuitarButton style={place(guitarBox)} />
      {nap && at ? (
        <div
          aria-hidden="true"
          title="pick me up"
          className="pointer-events-none absolute touch-none"
          style={{
            left: `${(at.x / desk.width) * 100}%`,
            top: `${(at.y / desk.height) * 100}%`,
            width: `${(sleepingCat.width / desk.width) * 100}%`,
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            wakeCat(e.clientX, e.clientY);
          }}
        >
          <Pixel
            width={sleepingCat.width}
            height={sleepingCat.height}
            rects={[...(nap.spot === "home" ? sleepingCat.home : sleepingCat.curled), handle]}
            className="block w-full"
          />
        </div>
      ) : null}
    </div>
  );
}
