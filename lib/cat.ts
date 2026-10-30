// Whether the cat is asleep at the desk on the home page, and where. Kept outside
// React so it lasts while you move between pages: the desk draws the sleeping cat,
// components/Cat.tsx draws it awake.

// x, y are in units of the desk drawing: the middle of the cat, and the top of what
// it's lying on.
export type Nap = { spot: "home" } | { spot: "bed"; x: number; y: number };

let nap: Nap | null = { spot: "home" };
const listeners = new Set<() => void>();
let waker: ((x: number, y: number) => void) | null = null;

export const catNap = {
  get: () => nap,
  set(next: Nap | null) {
    nap = next;
    for (const fn of listeners) fn();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

// Picking up the sleeping cat: the awake cat takes over, held at the pointer.
export function wakeCat(x: number, y: number) {
  waker?.(x, y);
}

export function onWake(fn: (x: number, y: number) => void) {
  waker = fn;
  return () => {
    if (waker === fn) waker = null;
  };
}
