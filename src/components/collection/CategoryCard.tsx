import Link from "next/link";
import { Illustration } from "@/components/art/Illustration";
import { ArrowIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { collectionPresentation } from "@/lib/commerce/presentation";
import type { Collection } from "@/lib/commerce/types";
import styles from "./CategoryCard.module.css";

export async function CategoryCard({ collection }: { collection: Collection }) {
  const { lang, dict } = await getI18n();
  const look = collectionPresentation(collection.handle, collection.title);
  const photo = collection.image
    ? { src: collection.image.url, alt: collection.image.altText || collection.title }
    : look.photo
      ? { src: look.photo.src, alt: dict.photos[look.photo.alt] }
      : null;
  return (
    <Link
      href={localizePath(lang, `/collections/${collection.handle}`)}
      className={`${styles.cat} ${look.tile}`}
    >
      <span className={styles.pic}>
        <Illustration name={look.illustration} className={styles.art} />
        {photo ? (
          <Photo
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 540px) 100vw, 560px"
            className={styles.photo}
          />
        ) : null}
      </span>
      <span className={styles.txt}>
        <span>
          <h3>{collection.title}</h3>
          {collection.description ? <p>{collection.description}</p> : null}
        </span>
        <span className={styles.arrow}>
          <ArrowIcon />
        </span>
      </span>
    </Link>
  );
}
