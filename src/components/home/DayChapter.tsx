import type { ReactNode } from "react";
import { DAY_TIMES, type Moment } from "@/lib/content/day";
import styles from "./Day.module.css";

/** One paw print; `clean` draws its outline, as after the wash. */
export function PawPrint({ clean, className }: { clean?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 210"
      className={`${clean ? styles.pawClean : styles.pawMuddy}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <ellipse cx="38" cy="92" rx="19" ry="25" transform="rotate(-24 38 92)" />
      <ellipse cx="78" cy="48" rx="20" ry="27" transform="rotate(-8 78 48)" />
      <ellipse cx="124" cy="48" rx="20" ry="27" transform="rotate(8 124 48)" />
      <ellipse cx="164" cy="92" rx="19" ry="25" transform="rotate(24 164 92)" />
      <path d="M101 198 C60 200 36 172 52 142 C66 116 136 116 150 142 C166 172 142 200 101 198 Z" />
    </svg>
  );
}

type Props = {
  /** The moment of the day; "end" is the closing chapter, after the clock stops. */
  moment: Moment | "end";
  /** How many paw prints run down the side. */
  paws?: number;
  labelledBy: string;
  children: ReactNode;
};

/**
 * A chapter of the day. Down its side runs the trail: the sun (or moon) with
 * the time, which stays in view while the chapter scrolls, and the paw
 * prints: muddy until the wash, clean after it.
 */
export function DayChapter({ moment, paws = 0, labelledBy, children }: Props) {
  const clean = moment !== "dawn" && moment !== "walk";
  return (
    <section
      id={moment}
      className={`${styles.ch} ${styles[moment]}${moment === "night" || moment === "end" ? " night" : ""}`}
      data-moment={moment}
      aria-labelledby={labelledBy}
    >
      {moment === "night" ? <span className={styles.stars} aria-hidden="true" /> : null}
      <div className={styles.inner}>
        <div className={styles.rail} aria-hidden="true">
          {moment !== "end" ? (
            <div className={styles.stamp}>
              <span className={moment === "night" ? `${styles.orb} ${styles.moon}` : styles.orb} />
              <span className={`mono ${styles.time}`}>{DAY_TIMES[moment]}</span>
            </div>
          ) : null}
          {paws ? (
            <div className={styles.trail}>
              {Array.from({ length: paws }, (_, i) => (
                <PawPrint key={i} clean={clean} />
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
