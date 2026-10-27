"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EASE, prefersReducedMotion, useScrollScene } from "@/lib/motion/gsap";
import styles from "./HomeHero.module.css";

type Props = {
  slides: { src: string; alt: string; ai?: boolean; focus?: string }[];
  eyebrow: string;
  line1: string;
  line2: string;
  lead: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  ticker: string[];
  labels: {
    scroll: string;
    slides: string;
    pause: string;
    play: string;
    aiNote: string;
  };
};

const SLIDE_MS = 6000;

/**
 * Full-screen opening: pet photos cross-fade with a slow zoom, the headline
 * rises line by line, a gold underline draws itself, and a ticker of our
 * promises runs along the bottom. Scrolling away scales the photo and lifts
 * the text (GSAP). The slideshow can be paused, and doesn't move at all with
 * reduced motion.
 */
export function HomeHero({
  slides,
  eyebrow,
  line1,
  line2,
  lead,
  primary,
  secondary,
  ticker,
  labels,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || slides.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [playing, slides.length]);

  // Fill the screen below the header, however tall the header and offer bar are.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () =>
      el.style.setProperty(
        "--hero-top",
        `${el.getBoundingClientRect().top + window.scrollY}px`,
      );
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useScrollScene(root, ({ gsap, root }) => {
    const trigger = {
      trigger: root,
      start: "top top",
      end: "bottom top",
      scrub: true,
    };
    gsap.to(root.querySelector("[data-layer=photos]"), {
      scale: 1.12,
      yPercent: 8,
      ease: "none",
      scrollTrigger: trigger,
    });
    gsap.to(root.querySelector("[data-layer=text]"), {
      yPercent: -18,
      opacity: 0,
      ease: "none",
      scrollTrigger: trigger,
    });
    gsap.to(root.querySelector("[data-layer=shade]"), {
      opacity: 1,
      ease: EASE.inOut,
      scrollTrigger: trigger,
    });
  });

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title">
      <div
        className={styles.photos}
        data-layer="photos"
        role="group"
        aria-roledescription="slideshow"
        aria-label={labels.slides}
      >
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={styles.slide}
            data-active={i === active}
            aria-hidden={i !== active}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              preload={i === 0}
              quality={90}
              sizes="100vw"
              className={styles.photo}
              style={s.focus ? { objectPosition: s.focus } : undefined}
            />
          </div>
        ))}
      </div>
      {/* AI illustrations are labelled while they're on screen. */}
      {slides[active]?.ai ? (
        <span className={styles.aiNote}>{labels.aiNote}</span>
      ) : null}
      <div className={styles.shade} aria-hidden="true" />
      <div
        className={styles.shadeScroll}
        data-layer="shade"
        aria-hidden="true"
      />

      <div className={`wrap ${styles.text}`} data-layer="text">
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>
            <span className={styles.lineInner}>{line1}</span>
          </span>
          <span className={styles.line}>
            <em className={`${styles.lineInner} ${styles.gold}`}>{line2}</em>
            <svg
              className={styles.swash}
              viewBox="0 0 400 24"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M4 16 C 90 4, 210 4, 396 14" />
            </svg>
          </span>
        </h1>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.ctas}>
          <Link href={primary.href} className="btn btn-gold">
            {primary.label}
          </Link>
          <Link
            href={secondary.href}
            className={`btn btn-ghost ${styles.ghost}`}
          >
            {secondary.label}
          </Link>
        </div>
      </div>

      <div className={styles.controls}>
        <span className={styles.scrollCue} aria-hidden="true">
          {labels.scroll}
          <i />
        </span>
        {slides.length > 1 ? (
          <span className={styles.dots}>
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={styles.dot}
                aria-label={`${i + 1} / ${slides.length}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
              />
            ))}
            <button
              type="button"
              className={styles.pause}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? labels.pause : labels.play}
            </button>
          </span>
        ) : null}
      </div>

      <div className={styles.ticker} aria-label={ticker.join(" · ")}>
        <div className={styles.tickerTrack} aria-hidden="true">
          {[0, 1].map((copy) => (
            <span key={copy} className={styles.tickerGroup}>
              {ticker.map((item) => (
                <span key={item}>
                  {item}
                  <b>✦</b>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
