"use client";

import { SoftImage } from "@/components/ui/SoftImage";
import Link from "next/link";
import { useRef } from "react";
import { useScrollScene } from "@/lib/motion/gsap";
import { useDragScroll } from "./useDragScroll";
import { useRailFocus } from "./useRailFocus";
import styles from "./AfterWalk.module.css";

type Scene = {
  title: string;
  text: string;
  photo: { src: string; alt: string };
  ai?: boolean;
};

/**
 * How the paw washer works, as a row of scenes. On computers the row moves
 * sideways as the page scrolls down (GSAP pin); on phones, and with reduced
 * motion, it's an ordinary row to swipe or drag.
 */
export function AfterWalk({
  eyebrow,
  title,
  lead,
  scenes,
  cta,
  aiNote,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  scenes: Scene[];
  cta: { href: string; label: string };
  aiNote: string;
}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  useDragScroll(track);
  useRailFocus(track, "(max-width: 899px)");

  useScrollScene(root, ({ gsap, root }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const row = track.current!;
      root.dataset.pinned = "";
      const distance = () => row.scrollWidth - row.clientWidth;
      gsap.to(row.children, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top+=60",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            root.style.setProperty("--progress", String(self.progress)),
        },
      });
      return () => {
        delete root.dataset.pinned;
        root.style.removeProperty("--progress");
      };
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} className={styles.section} aria-labelledby="care-title">
      <div className={`wrap ${styles.head}`}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="care-title" className={styles.title} data-rise>
            {title}
          </h2>
        </div>
        <p className={styles.lead}>{lead}</p>
      </div>
      <ol ref={track} className={styles.track}>
        {scenes.map((s, i) => (
          <li key={s.title} className={styles.scene}>
            <div className={`${styles.pic} soft-frame`}>
              <SoftImage
                src={s.photo.src}
                alt={s.photo.alt}
                fill
                quality={75}
                sizes="(max-width: 900px) 80vw, 40vw"
                className={styles.photo}
              />
              {s.ai ? <span className={styles.aiNote}>{aiNote}</span> : null}
            </div>
            <span className={styles.num} aria-hidden="true">
              0{i + 1}
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
        <li className={styles.end}>
          <Link href={cta.href} className="btn btn-gold">
            {cta.label}
          </Link>
        </li>
      </ol>
      <div className={`wrap ${styles.bar}`} aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
