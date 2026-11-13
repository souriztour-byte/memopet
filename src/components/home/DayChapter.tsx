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
  /** What the time stamp opens when tapped: "The day, hour by hour". */
  dayLabel: string;
  children: ReactNode;
};

/**
 * A chapter of the day. Down its side runs the trail: the sun (or moon) with
 * the time, which stays in view while the chapter scrolls, and the paw
 * prints: muddy until the wash, clean after it.
 */
export function DayChapter({ moment, paws = 0, labelledBy, dayLabel, children }: Props) {
  const clean = moment !== "dawn" && moment !== "walk";
  return (
    <section
      id={moment}
      className={`${styles.ch} ${styles[moment]}${moment === "night" || moment === "end" ? " night" : ""}`}
      data-moment={moment}
      aria-labelledby={labelledBy}
    >
      {moment === "night" ? (
        <>
          {/* The last of the sun, sinking as the night chapter scrolls in. */}
          <span className={styles.dusk} aria-hidden="true">
            <span className={styles.sunset} data-sunset />
          </span>
          <span className={styles.stars} aria-hidden="true" />
        </>
      ) : null}
      <div className={styles.inner}>
        <div className={styles.rail}>
          {moment !== "end" ? (
            // Tapping the time opens the day's list, to jump to another moment.
            <button
              type="button"
              className={styles.stamp}
              data-day-chip
              aria-haspopup="dialog"
              aria-label={`${DAY_TIMES[moment]} · ${dayLabel}`}
            >
              <span className={moment === "night" ? `${styles.orb} ${styles.moon}` : styles.orb} aria-hidden="true" />
              <span className={`mono ${styles.time}`}>{DAY_TIMES[moment]}</span>
            </button>
          ) : null}
          {paws ? (
            <div className={styles.trail} aria-hidden="true">
              {Array.from({ length: paws }, (_, i) => (
                <PawPrint key={i} clean={clean} />
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.content}>
          {children}
          {/* Phones have no side trail: the prints walk across between chapters instead. */}
          {paws && moment !== "night" ? (
            <div className={styles.steps} aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <PawPrint key={i} clean={clean} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
