"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./ComfortStory.module.css";

type Step = {
  title: string;
  text: string;
  photo: { src: string; alt: string };
};

/**
 * A photo that stays in place while three short paragraphs scroll past; the
 * photo changes to match the paragraph in the middle of the screen. Plain
 * page scrolling: nothing is held back or forced. Phones get a simple
 * photo-then-paragraph column.
 */
export function ComfortStory({
  eyebrow,
  title,
  steps,
  cta,
}: {
  eyebrow: string;
  title: string;
  steps: Step[];
  cta: { href: string; label: string };
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.story} aria-labelledby="comfort-title">
      <div className={styles.media}>
        <div className={styles.frame}>
          {/* next/image needs a positioned parent; the frame itself is sticky. */}
          <div className={styles.photos}>
            {steps.map((s, i) => (
              <Image
                key={s.photo.src}
                src={s.photo.src}
                alt={s.photo.alt}
                fill
                quality={90}
                sizes="(max-width: 900px) 100vw, 50vw"
                className={styles.photo}
                data-active={i === active}
              />
            ))}
          </div>
          <span className={styles.counter} aria-hidden="true">
            0{active + 1} <i>/ 0{steps.length}</i>
          </span>
        </div>
      </div>
      <div className={styles.text}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="comfort-title" className={styles.title} data-rise>
          {title}
        </h2>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              data-active={i === active}
              className={styles.step}
            >
              {/* Phones show each photo with its paragraph instead of the pinned one. */}
              <div className={`${styles.stepPic} unveil`} data-drift>
                <Image
                  src={s.photo.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className={styles.cover}
                />
              </div>
              <span className={styles.num} aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <Link href={cta.href} className="btn btn-gold">
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
