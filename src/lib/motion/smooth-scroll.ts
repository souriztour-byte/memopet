import type Lenis from "lenis";

type Listener = (lenis: Lenis | null) => void;

let current: Lenis | null = null;
const listeners = new Set<Listener>();

/** The page's smooth scroller while it runs (SmoothScroll.tsx), else null. */
export const smoothScroll = () => current;

export function setSmoothScroll(lenis: Lenis | null) {
  current = lenis;
  listeners.forEach((fn) => fn(lenis));
}

/** Calls `fn` now and whenever the smooth scroller starts or stops. Returns the unsubscribe. */
export function onSmoothScroll(fn: Listener) {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}
