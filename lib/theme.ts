// Light or dark. The truth is the `.dark` class on <html> (set before paint by the
// script in app/layout.tsx); this just flips it, remembers the choice, and tells
// whoever's listening: the header toggle and the lamp on the desk.

const listeners = new Set<() => void>();

export const theme = {
  // null on the server, where there's no <html> to look at yet.
  get: (): boolean | null => document.documentElement.classList.contains("dark"),
  getServer: () => null,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function setDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // Private mode or blocked storage: it still works for this visit.
  }
  for (const fn of listeners) fn();
}

export function toggleTheme() {
  setDark(!theme.get());
}
