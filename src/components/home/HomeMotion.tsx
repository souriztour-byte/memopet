"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE, useScrollScene } from "@/lib/motion/gsap";

/**
 * Scroll behaviour shared by the home page chapters:
 * - the chapter under the top of the screen is named on `html[data-moment]`,
 *   so the header takes on that moment's light as the day goes by;
 * - `data-rise` titles rise into place the first time they scroll into view;
 * - the day dial (`data-day-dial`) is told how far through the day the page
 *   is, and which of its stops is the current one;
 * - photos in `data-drift` frames move a little inside their frame as the
 *   page scrolls, for a sense of depth (more on phones, gently on computers).
 * Nothing here holds up scrolling, and it's all skipped with reduced motion.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const chapters = [...el.querySelectorAll<HTMLElement>("[data-moment]")];
    const dial = el.querySelector<HTMLElement>("[data-day-dial]");
    const links = [...el.querySelectorAll<HTMLElement>("[data-day-link]")];
    const html = document.documentElement;
    let shown = "";
    let frame = 0;
    const update = () => {
      frame = 0;
      // The chapter the header is sitting on (on phones the header may be tucked away).
      const header = document.querySelector("header");
      const line = Math.max(header?.getBoundingClientRect().bottom ?? 0, 0) + 8;
      const current =
        chapters.findLast((c) => c.getBoundingClientRect().top <= line) ?? chapters[0];
      if (!current) return;
      const moment = current.dataset.moment ?? "";
      html.dataset.moment = moment;
      // How far through the day: each stop of the dial is one chapter.
      if (dial && links.length) {
        const box = current.getBoundingClientRect();
        const through = Math.min(Math.max((line - box.top) / box.height, 0), 1);
        const day = Math.min((chapters.indexOf(current) + through) / links.length, 1);
        dial.style.setProperty("--day", day.toFixed(4));
      }
      if (moment !== shown) {
        shown = moment;
        for (const link of links) {
          if (link.dataset.dayLink === moment) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        }
      }
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

    // The muddy prints of the walk appear one after another.
    for (const splat of root.querySelectorAll<SVGElement>("[data-splat]")) {
      gsap.from(splat.querySelectorAll("g, circle"), {
        opacity: 0,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: { trigger: splat, start: "top 88%", end: "top 40%", scrub: true },
      });
    }

    // Photos move a little inside their frames: more on phones, gently on computers.
    const drift = (shift: number, scale: number) => {
      for (const frame of root.querySelectorAll<HTMLElement>("[data-drift]")) {
        // A frame whose photo can change marks a steady layer to move instead.
        const layer = frame.querySelector("[data-drift-layer]") ?? frame.querySelector("img");
        if (!layer) continue;
        gsap.fromTo(
          layer,
          { yPercent: -shift, scale },
          {
            yPercent: shift,
            scale,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    };
    const mm = gsap.matchMedia();
    mm.add("(max-width: 900px)", () => drift(7, 1.16));
    mm.add("(min-width: 901px)", () => {
      drift(3.5, 1.08);
      // The sun behind the first photo keeps rising as the morning scrolls away.
      for (const sun of root.querySelectorAll<HTMLElement>("[data-sun]")) {
        gsap.to(sun, {
          y: -90,
          ease: "none",
          scrollTrigger: { trigger: sun, start: "top 20%", end: "bottom top", scrub: true },
        });
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
