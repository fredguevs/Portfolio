"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { flick } from "@/lib/sound";
import { setDark, theme } from "@/lib/theme";

// An invisible button over the lamp on the desk (components/Desk.tsx). Clicking it
// flicks the lamp on or off with a click of the switch, and the page goes dark or
// light with it, same as the toggle in the header: on at night, off in daylight
// (see .lamp-light in globals.css).
export function LampButton({ style }: { style?: CSSProperties }) {
  const dark = useSyncExternalStore(theme.subscribe, theme.get, theme.getServer);

  return (
    <button
      type="button"
      onClick={() => {
        flick(!dark);
        setDark(!dark);
      }}
      aria-label={dark ? "Turn the lamp off (light mode)" : "Turn the lamp on (dark mode)"}
      title={dark ? "lamp off" : "lamp on"}
      className="lamp absolute cursor-pointer"
      style={style}
    />
  );
}
