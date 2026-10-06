"use client";

import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./status.module.css";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang, dict } = useI18n();
  return (
    <div className={`wrap ${styles.status}`}>
      <p className="eyebrow">{dict.error.eyebrow}</p>
      <h1>{dict.error.title}</h1>
      <p className="lead">{dict.error.lead}</p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-pink" onClick={reset}>
          {dict.error.retry}
        </button>
        <Link href={localizePath(lang, "/")} className="btn btn-ghost">
          {dict.common.backHome}
        </Link>
      </div>
    </div>
  );
}
