import type { ProductVideo } from "@/lib/commerce/types";
import styles from "./ProductVideos.module.css";

/**
 * Demonstration videos from the product's media in Shopify: uploaded videos
 * play here; YouTube or Vimeo links are embedded.
 */
export function ProductVideos({ videos, title }: { videos: ProductVideo[]; title: string }) {
  return (
    <div className={videos.length > 1 ? `${styles.grid} ${styles.two}` : styles.grid}>
      {videos.map((v, i) =>
        v.sources.length ? (
          <video
            key={i}
            className={styles.video}
            controls
            playsInline
            preload="metadata"
            poster={v.poster?.url}
            aria-label={v.alt || title}
          >
            {[...v.sources]
              // MP4 first: every phone browser can play it.
              .sort((a, b) => (a.mimeType === "video/mp4" ? -1 : 0) - (b.mimeType === "video/mp4" ? -1 : 0))
              .map((s) => (
                <source key={s.url} src={s.url} type={s.mimeType} />
              ))}
          </video>
        ) : v.embedUrl ? (
          <iframe
            key={i}
            className={styles.video}
            src={v.embedUrl}
            title={v.alt || title}
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : null,
      )}
    </div>
  );
}
