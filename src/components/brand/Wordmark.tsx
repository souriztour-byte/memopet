import { siteConfig } from "@/lib/config";
import styles from "./Wordmark.module.css";

/** The gold paw-heart mark and the shop name in bold serif capitals. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`${styles.wordmark} ${className ?? ""}`}>
      <svg viewBox="20 12 160 180" className={styles.mark} aria-hidden="true" focusable="false">
        <g fill="var(--gold)">
          <ellipse cx="46" cy="84" rx="17" ry="22" transform="rotate(-25 46 84)" />
          <ellipse cx="80" cy="46" rx="18" ry="24" transform="rotate(-8 80 46)" />
          <ellipse cx="120" cy="46" rx="18" ry="24" transform="rotate(8 120 46)" />
          <ellipse cx="154" cy="84" rx="17" ry="22" transform="rotate(25 154 84)" />
        </g>
        <path
          d="M100 184 C54 156 38 132 44 108 C50 84 84 78 100 102 C116 78 150 84 156 108 C162 132 146 156 100 184 Z"
          fill="var(--gold-ink)"
        />
      </svg>
      <span className={styles.name}>{siteConfig.name}</span>
    </span>
  );
}
