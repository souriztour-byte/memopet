"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Phones: as a swipe row moves, the card at the front is full size and the
 * others shrink and fade a little (CSS reads `--focus`, 0–1, on each card).
 * When the row first comes into view it nudges sideways once, to show it
 * can be swiped. Off with reduced motion. `row` changes when the row is
 * replaced (e.g. a new pet chosen), so the new one is followed too.
 */
export function useRailFocus(
  ref: RefObject<HTMLElement | null>,
  query: string,
  row?: unknown,
) {
  const nudged = useRef(false);
  useEffect(() => {
    const el = ref.current;
    const media = window.matchMedia(
      `${query} and (prefers-reduced-motion: no-preference)`,
    );
    if (!el || !media.matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start =
        el.getBoundingClientRect().left +
        parseFloat(getComputedStyle(el).scrollPaddingInlineStart || "0");
      for (const child of el.children as HTMLCollectionOf<HTMLElement>) {
        const box = child.getBoundingClientRect();
        const away = Math.min(1, Math.abs(box.left - start) / box.width);
        child.style.setProperty("--focus", (1 - away).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // The one-time nudge, unless the shopper has already touched the row.
    let touched = false;
    const touch = () => (touched = true);
    el.addEventListener("pointerdown", touch, { once: true });
    let back: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (
          nudged.current ||
          touched ||
          el.scrollLeft > 0 ||
          el.scrollWidth <= el.clientWidth
        )
          return;
        nudged.current = true;
        el.scrollTo({ left: 64, behavior: "smooth" });
        back = setTimeout(
          () => !touched && el.scrollTo({ left: 0, behavior: "smooth" }),
          650,
        );
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(back);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", touch);
      window.removeEventListener("resize", onScroll);
      for (const child of el.children as HTMLCollectionOf<HTMLElement>)
        child.style.removeProperty("--focus");
    };
  }, [ref, query, row]);
}
