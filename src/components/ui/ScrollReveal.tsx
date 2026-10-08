"use client";

import { useEffect } from "react";

/**
 * Lets page sections glide in as they scroll into view (styles in globals.css).
 * Anything already on screen is shown straight away (`is-shown`), sections
 * further down fade in when they arrive (`is-in`), and nothing is hidden
 * unless this runs, so the page reads fine without JavaScript or with reduced
 * motion. Watches for new sections after client-side navigation.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    const scan = () => {
      for (const el of main.querySelectorAll(".block > :not(.is-in, .is-shown)")) {
        // Already on screen: just show it. Further down: fade it in on arrival.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add("is-shown");
        else io.observe(el);
      }
    };
    scan();
    document.documentElement.classList.add("motion");
    const mo = new MutationObserver(scan);
    mo.observe(main, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      document.documentElement.classList.remove("motion");
    };
  }, []);
  return null;
}
