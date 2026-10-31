"use client";

import { useSyncExternalStore } from "react";
import { theme, toggleTheme } from "@/lib/theme";
import { Icon } from "./Icon";

// The initial class is set by the inline script in layout.tsx, before React loads,
// so there's no flash. This button just flips it (so does the lamp on the desk).
export function ThemeToggle() {
  const dark = useSyncExternalStore(theme.subscribe, theme.get, theme.getServer);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-6 cursor-pointer items-center justify-center"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Lights on" : "Lights off"}
    >
      {dark === null ? null : <Icon name={dark ? "sun" : "moon"} />}
    </button>
  );
}
