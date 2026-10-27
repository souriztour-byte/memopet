"use client";

import { useEffect } from "react";

/**
 * Marks <html data-scrolled> once the page has scrolled a little, so the
 * header can slim down, and <html data-scroll-down> while the reader is
 * scrolling down, so phones can tuck the header away until they scroll back
 * up (Header.module.css).
 */
export function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let last = window.scrollY;
    const update = () => {
      frame = 0;
      // Different on/off points, so the header shrinking (which moves the
      // page up a little) can't flip it straight back.
      const y = window.scrollY;
      if (y > 80) root.setAttribute("data-scrolled", "");
      else if (y < 20) root.removeAttribute("data-scrolled");
      // A few pixels of slack, so a wobbling finger doesn't flicker it.
      if (y > last + 8 && y > 200) root.setAttribute("data-scroll-down", "");
      else if (y < last - 8 || y <= 200) root.removeAttribute("data-scroll-down");
      if (Math.abs(y - last) > 8) last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      root.removeAttribute("data-scrolled");
      root.removeAttribute("data-scroll-down");
    };
  }, []);
  return null;
}
