"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Image as ImageType } from "@/lib/commerce/types";
import styles from "./BeforeAfter.module.css";

/** Drag the handle (or use the arrow keys on the slider) to compare two photos. */
export function BeforeAfter({ before, after }: { before: ImageType; after: ImageType }) {
  const { dict } = useI18n();
  const t = dict.product;
  const [split, setSplit] = useState(50);
  return (
    <div className={styles.frame} style={{ "--split": `${split}%` } as React.CSSProperties}>
      <Image src={after.url} alt={after.altText ?? t.afterLabel} fill sizes="(max-width: 760px) 100vw, 900px" className={styles.photo} />
      <div className={styles.before}>
        <Image src={before.url} alt={before.altText ?? t.beforeLabel} fill sizes="(max-width: 760px) 100vw, 900px" className={styles.photo} />
      </div>
      <span className={`${styles.label} ${styles.labelBefore}`}>{t.beforeLabel}</span>
      <span className={`${styles.label} ${styles.labelAfter}`}>{t.afterLabel}</span>
      <span className={styles.handle} aria-hidden="true" />
      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        className={styles.range}
        aria-label={t.compareLabel}
      />
    </div>
  );
}
