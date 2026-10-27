"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollScene } from "@/lib/motion/gsap";
import styles from "./BrandStory.module.css";

/**
 * Our story in one paragraph; its words light up one by one as it scrolls
 * through the screen. With reduced motion it's simply all there.
 */
export function BrandStory({
  eyebrow,
  text,
  cta,
}: {
  eyebrow: string;
  text: string;
  cta: { href: string; label: string };
}) {
  const root = useRef<HTMLElement>(null);

  useScrollScene(root, ({ gsap, root }) => {
    gsap.fromTo(
      root.querySelectorAll("[data-word]"),
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector("p"),
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      },
    );
    gsap.fromTo(
      root.querySelector("[data-watermark]"),
      { xPercent: 8 },
      {
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  return (
    <section ref={root} className={styles.story} aria-labelledby="story-title">
      <span className={styles.watermark} data-watermark aria-hidden="true">
        MimiPets
      </span>
      <div className={`wrap ${styles.inner}`}>
        <h2 id="story-title" className="eyebrow">
          {eyebrow}
        </h2>
        <p className={styles.text}>
          {text.split(" ").map((word, i) => (
            <span key={i} data-word>
              {word}{" "}
            </span>
          ))}
        </p>
        <Link href={cta.href} className="btn btn-ghost">
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
