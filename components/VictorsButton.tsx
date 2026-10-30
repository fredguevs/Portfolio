"use client";

import { useEffect, useRef, useState } from "react";
import { playVictors } from "@/lib/sound";
import { ArtSlot } from "./ArtSlot";

// The Michigan block M. Click it to play "The Victors", click again to stop.
export function VictorsButton({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const stop = useRef<(() => void) | null>(null);

  // Stop the music if you leave the page.
  useEffect(() => () => stop.current?.(), []);

  function toggle() {
    if (playing) {
      stop.current?.();
      stop.current = null;
      setPlaying(false);
    } else {
      stop.current = playVictors(() => {
        stop.current = null;
        setPlaying(false);
      });
      setPlaying(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Stop The Victors" : "Play The Victors"}
      title={playing ? "stop" : "play the victors"}
      className={`victors cursor-pointer ${playing ? "is-playing" : ""} ${className ?? ""}`}
    >
      <ArtSlot name="michigan" decorative className="w-full" />
    </button>
  );
}
