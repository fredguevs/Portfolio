"use client";

import { useEffect, useRef, useState } from "react";
import { strumGuitar } from "@/lib/sound";
import { ArtSlot } from "./ArtSlot";
import { Pixel, type Rect } from "./Pixel";

// The guitar in "things i like". Click it to strum D, C, Bm, A7; a little music
// note floats up out of it on every chord. Clicking again starts over.

const ink = "var(--pixel-ink)";
const eighthNote: Rect[] = [
  [0, 5, 3, 2, ink], // head
  [2, 0, 1, 6, ink], // stem
  [3, 1, 1, 1, ink], // flag
  [4, 2, 1, 2, ink],
];
const NOTE_LIFE = 1400; // ms, matches the guitar-note animation in globals.css

type Note = { id: number; drift: number };

export function GuitarButton({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const stop = useRef<(() => void) | null>(null);
  const nextId = useRef(0);

  // Stop strumming if you leave the page.
  useEffect(() => () => stop.current?.(), []);

  function play() {
    stop.current?.();
    setPlaying(true);
    stop.current = strumGuitar(
      (chord) => {
        const id = nextId.current++;
        // Alternate sides so the notes don't stack on top of each other.
        setNotes((n) => [...n, { id, drift: chord % 2 ? 6 : -6 }]);
        setTimeout(() => setNotes((n) => n.filter((note) => note.id !== id)), NOTE_LIFE);
      },
      () => {
        stop.current = null;
        setPlaying(false);
      },
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label="Strum the guitar"
      title="strum"
      className={`guitar relative cursor-pointer ${playing ? "is-playing" : ""} ${className ?? ""}`}
    >
      <ArtSlot name="guitar" decorative className="block w-full" />
      {notes.map(({ id, drift }) => (
        <span
          key={id}
          aria-hidden="true"
          className="guitar-note pointer-events-none absolute w-3/5"
          style={{ "--drift": `${drift}px` } as React.CSSProperties}
        >
          <Pixel width={5} height={7} rects={eighthNote} className="block w-full" />
        </span>
      ))}
    </button>
  );
}
