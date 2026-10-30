"use client";

import { useSyncExternalStore } from "react";
import { catNap, wakeCat } from "@/lib/cat";
import { ArtSlot } from "./ArtSlot";
import { desk, sleepingCat } from "./art/desk";
import { Pixel, type Rect } from "./Pixel";

// The desk on the home page, with the cat asleep on it while it's there. Grab the
// cat and it wakes up and becomes components/Cat.tsx; put it back on the monitor or
// the desk and it goes back to sleep here.

// Where you can grab it: round its body and head, not the empty space round the z's.
const handle: Rect = [0, 5, 19, 8, "transparent", "nap-handle"];

export function Desk({ className }: { className?: string }) {
  const nap = useSyncExternalStore(catNap.subscribe, catNap.get, catNap.get);

  const at =
    nap?.spot === "home"
      ? sleepingCat.homeAt
      : nap
        ? { x: nap.x - sleepingCat.middle, y: nap.y - sleepingCat.floor }
        : null;

  return (
    <div className={`relative ${className ?? ""}`}>
      <ArtSlot name="desk" className="block w-full" />
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
