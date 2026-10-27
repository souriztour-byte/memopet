"use client";

import { useRef, type ReactNode } from "react";
import { EASE, useScrollScene } from "@/lib/motion/gsap";

/**
 * Scroll motion shared by the home page sections:
 * - `data-rise` titles rise into place the first time they scroll into view;
 * - on phones, photos in `data-drift` frames move a little inside their
 *   frame as the page scrolls, for a sense of depth.
 * Nothing here holds up scrolling, and it's all skipped with reduced motion.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useScrollScene(root, ({ gsap, root }) => {
    for (const title of root.querySelectorAll<HTMLElement>("[data-rise]")) {
      gsap.fromTo(
        title,
        { y: 36, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% -20% 0%)",
          duration: 1.1,
          ease: EASE.out,
          clearProps: "clipPath,transform,opacity",
          scrollTrigger: { trigger: title, start: "top 92%", once: true },
        },
      );
    }

    const mm = gsap.matchMedia();
    mm.add("(max-width: 900px)", () => {
      for (const frame of root.querySelectorAll<HTMLElement>("[data-drift]")) {
        // A frame whose photo can change marks a steady layer to move instead.
        const layer =
          frame.querySelector("[data-drift-layer]") ??
          frame.querySelector("img");
        if (!layer) continue;
        gsap.fromTo(
          layer,
          { yPercent: -7, scale: 1.16 },
          {
            yPercent: 7,
            scale: 1.16,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    });
    return () => mm.revert();
  });

  return (
    <div ref={root} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
