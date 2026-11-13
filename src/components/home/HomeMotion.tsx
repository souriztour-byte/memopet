"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE, useScrollScene } from "@/lib/motion/gsap";

/**
 * Scroll behaviour shared by the home page chapters:
 * - the chapter under the top of the screen is named on `html[data-moment]`,
 *   so the header takes on that moment's light as the day goes by;
 * - `data-rise` titles rise into place the first time they scroll into view;
 * - on phones, photos in `data-drift` frames move a little inside their
 *   frame as the page scrolls, for a sense of depth.
 * Nothing here holds up scrolling, and it's all skipped with reduced motion.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const chapters = [...el.querySelectorAll<HTMLElement>("[data-moment]")];
    const html = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      // The chapter the header is sitting on (on phones the header may be tucked away).
      const header = document.querySelector("header");
      const line = Math.max(header?.getBoundingClientRect().bottom ?? 0, 0) + 8;
      const current =
        chapters.findLast((c) => c.getBoundingClientRect().top <= line) ?? chapters[0];
      if (current) html.dataset.moment = current.dataset.moment;
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete html.dataset.moment;
    };
  }, []);

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
