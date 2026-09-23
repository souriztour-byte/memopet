"use client";

import Link from "next/link";
import styles from "./status.module.css";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={`wrap ${styles.status}`}>
      <p className="eyebrow">Something went wrong</p>
      <h1>We couldn&rsquo;t load this page.</h1>
      <p className="lead">Please try again in a moment.</p>
      <div className={styles.actions}>
        <button type="button" className="btn btn-pink" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
