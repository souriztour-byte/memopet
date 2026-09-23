import Link from "next/link";
import { Illustration } from "@/components/art/Illustration";
import styles from "./status.module.css";

export default function NotFound() {
  return (
    <div className={`wrap ${styles.status}`}>
      <div className={`${styles.art} t1`}>
        <Illustration name="toys" />
      </div>
      <p className="eyebrow">Page not found</p>
      <h1>This page ran off to play.</h1>
      <p className="lead">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <div className={styles.actions}>
        <Link href="/" className="btn btn-pink">
          Back to home
        </Link>
        <Link href="/shop" className="btn btn-ghost">
          Shop all
        </Link>
      </div>
    </div>
  );
}
