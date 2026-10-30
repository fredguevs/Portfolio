"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

// The initial class is set by the inline script in layout.tsx, before React loads,
// so there's no flash. This button just flips it and remembers the choice.
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private mode or blocked storage: the toggle still works for this visit.
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-6 cursor-pointer items-center justify-center"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Lights on" : "Lights off"}
    >
      {dark === null ? null : <Icon name={dark ? "sun" : "moon"} />}
    </button>
  );
}
