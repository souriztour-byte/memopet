"use client";

import { useEffect } from "react";
import { setSmoothScroll, smoothScroll } from "@/lib/motion/smooth-scroll";

/**
 * Computers: the page glides to where the mouse wheel sends it instead of
 * jumping there (Lenis). Scrolling stays the browser's own, so sticky
 * sections, anchors and scroll animations work as before. Touch screens
 * already scroll smoothly and are left alone, as is anyone who asks their
 * device for reduced motion. Where each page starts and where Back returns to
 * is ScrollMemory.tsx's job.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let cancelled = false;
    let stop: (() => void) | undefined;

    const start = async () => {
      if (!media.matches || smoothScroll()) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled || !media.matches || smoothScroll()) return;
      const lenis = new Lenis({
        autoRaf: true,
        anchors: true,
        lerp: 0.1,
        // Menus, the cart drawer and the search panel scroll by themselves.
        prevent: (node) => Boolean(node.closest("dialog, [data-scroll-native]")),
      });
      setSmoothScroll(lenis);
      stop = () => {
        lenis.destroy();
        setSmoothScroll(null);
      };
    };
    const onChange = () => {
      if (media.matches) start();
      else stop?.();
    };
    start();
    media.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      media.removeEventListener("change", onChange);
      stop?.();
    };
  }, []);

  return null;
}
