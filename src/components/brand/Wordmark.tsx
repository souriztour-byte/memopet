import { siteConfig } from "@/lib/config";
import styles from "./Wordmark.module.css";

/** The shop name set in spaced serif capitals — the logo of the black & gold look. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={`${styles.wordmark} ${className ?? ""}`}>{siteConfig.name}</span>;
}
