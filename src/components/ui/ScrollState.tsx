"use client";

import { useEffect } from "react";

/**
 * Marks <html data-scrolled> once the page has scrolled a little, so the
 * header can slim down (Header.module.css).
 */
export function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Different on/off points, so the header shrinking (which moves the
      // page up a little) can't flip it straight back.
      const y = window.scrollY;
      if (y > 80) root.setAttribute("data-scrolled", "");
      else if (y < 20) root.removeAttribute("data-scrolled");
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
    };
  }, []);
  return null;
}
