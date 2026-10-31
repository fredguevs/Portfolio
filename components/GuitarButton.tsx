"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { GUITAR_CHORDS, strumChord } from "@/lib/sound";
import { Pixel, type Rect } from "./Pixel";

// An invisible button over the guitar leaning on the desk (components/Desk.tsx).
// Each click strums the next chord of D, Bm, Em, A7 (then back to D), and a little
// music note floats up out of the sound hole.

const ink = "var(--pixel-ink)";
const eighthNote: Rect[] = [
  [0, 5, 3, 2, ink], // head
  [2, 0, 1, 6, ink], // stem
  [3, 1, 1, 1, ink], // flag
  [4, 2, 1, 2, ink],
];
const NOTE_LIFE = 1400; // ms, matches the guitar-note animation in globals.css

type Note = { id: number; drift: string };

export function GuitarButton({ style }: { style?: CSSProperties }) {
  const [playing, setPlaying] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const stop = useRef<(() => void) | null>(null);
  const chord = useRef(0);
  const nextId = useRef(0);

  // Stop the strings ringing if you leave the page.
  useEffect(() => () => stop.current?.(), []);

  function strum() {
    const i = chord.current;
    chord.current = (i + 1) % GUITAR_CHORDS;
    setPlaying(true);
    stop.current = strumChord(i, () => {
      stop.current = null;
      setPlaying(false);
    });

    const id = nextId.current++;
    // Alternate sides so the notes don't stack on top of each other.
    setNotes((n) => [...n, { id, drift: i % 2 ? "60%" : "-60%" }]);
    setTimeout(() => setNotes((n) => n.filter((note) => note.id !== id)), NOTE_LIFE);
  }

  return (
    <button
      type="button"
      onClick={strum}
      aria-label="Strum the guitar"
      title="strum"
      className={`guitar absolute cursor-pointer ${playing ? "is-playing" : ""}`}
      style={style}
    >
      {notes.map(({ id, drift }) => (
        <span
          key={id}
          aria-hidden="true"
          className="guitar-note pointer-events-none absolute"
          style={{ "--drift": drift } as CSSProperties}
        >
          <Pixel width={5} height={7} rects={eighthNote} className="block w-full" />
        </span>
      ))}
    </button>
  );
}
