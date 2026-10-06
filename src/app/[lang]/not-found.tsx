import Link from "next/link";
import { Illustration } from "@/components/art/Illustration";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import styles from "./status.module.css";

export default async function NotFound() {
  const { lang, dict } = await getI18n();
  return (
    <div className={`wrap ${styles.status}`}>
      <div className={`${styles.art} t1`}>
        <Illustration name="toys" />
      </div>
      <p className="eyebrow">{dict.notFound.eyebrow}</p>
      <h1>{dict.notFound.title}</h1>
      <p className="lead">{dict.notFound.lead}</p>
      <div className={styles.actions}>
        <Link href={localizePath(lang, "/")} className="btn btn-pink">
          {dict.common.backHome}
        </Link>
        <Link href={localizePath(lang, "/shop")} className="btn btn-ghost">
          {dict.common.shopAll}
        </Link>
      </div>
    </div>
  );
}
