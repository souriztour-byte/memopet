"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { smoothScroll } from "@/lib/motion/smooth-scroll";

const STORE = "mimipets:scroll";
const here = () => window.location.pathname + window.location.search;

/**
 * Back and Forward (and a reload) return to where the reader was on that
 * page. The browser would normally do this, but the home page's scroll
 * scenes re-measure the page as it comes back and the browser's attempt is
 * lost, so the site keeps the positions itself (per address, for the tab's
 * lifetime) and restores them once the page is tall enough again.
 */
export function ScrollMemory() {
  const pathname = usePathname();
  const restoring = useRef(false);

  useEffect(() => {
    let positions: Record<string, number> = {};
    try {
      positions = JSON.parse(sessionStorage.getItem(STORE) ?? "{}");
    } catch {
      // Private mode or a full store: positions last for this page view only.
    }
    const save = () => {
      try {
        sessionStorage.setItem(STORE, JSON.stringify(positions));
      } catch {}
    };
    const jump = (y: number) => {
      const lenis = smoothScroll();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" });
    };

    let timers: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;
    const done = () => {
      timers.forEach(clearTimeout);
      timers = [];
      cancelAnimationFrame(frame);
      restoring.current = false;
    };
    // Wait until the page is tall enough, go there, then go there again as the
    // scroll scenes settle. Any scrolling by the reader ends it at once.
    const restore = (target: number) => {
      done();
      if (window.location.hash || target < 1) return;
      restoring.current = true;
      let tries = 0;
      const step = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max < target - 1 && tries++ < 60) {
          frame = requestAnimationFrame(step);
          return;
        }
        jump(Math.min(target, max));
        for (const ms of [120, 350, 700]) {
          timers.push(setTimeout(() => Math.abs(window.scrollY - target) > 2 && jump(target), ms));
        }
        timers.push(setTimeout(done, 750));
      };
      frame = requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (!restoring.current) positions[here()] = Math.round(window.scrollY);
    };
    const onPop = () => restore(positions[here()] ?? 0);
    const onInput = () => restoring.current && done();

    history.scrollRestoration = "manual";
    const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (entry?.type === "reload" || entry?.type === "back_forward") restore(positions[here()] ?? 0);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    window.addEventListener("pagehide", save);
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchstart", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    return () => {
      done();
      save();
      history.scrollRestoration = "auto";
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchstart", onInput);
      window.removeEventListener("keydown", onInput);
    };
  }, []);

  // A new page starts at the top at once, not gliding up from the last one.
  useEffect(() => {
    const lenis = smoothScroll();
    if (lenis && !restoring.current && !window.location.hash) lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
