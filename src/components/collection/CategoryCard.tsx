import Link from "next/link";
import { Illustration } from "@/components/art/Illustration";
import { ArrowIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { collectionPresentation } from "@/lib/commerce/presentation";
import type { Collection } from "@/lib/commerce/types";
import styles from "./CategoryCard.module.css";

export function CategoryCard({ collection }: { collection: Collection }) {
  const look = collectionPresentation(collection.handle, collection.title);
  const photo = collection.image
    ? { src: collection.image.url, alt: collection.image.altText || collection.title }
    : look.photo;
  return (
    <Link href={`/collections/${collection.handle}`} className={`${styles.cat} ${look.tile}`}>
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
