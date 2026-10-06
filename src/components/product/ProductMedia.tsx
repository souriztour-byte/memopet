import Image from "next/image";
import { Illustration } from "@/components/art/Illustration";
import type { Illustration as IllustrationName, Image as ImageType } from "@/lib/commerce/types";
import styles from "./ProductMedia.module.css";

type Props = {
  image: ImageType | null;
  illustration: IllustrationName;
  alt: string;
  sizes: string;
  preload?: boolean;
};

/** Product photo when there is one, otherwise the prototype's illustration. */
export function ProductMedia({ image, illustration, alt, sizes, preload }: Props) {
  if (image) {
    return (
      <Image
        src={image.url}
        alt={image.altText || alt}
        fill
        sizes={sizes}
        preload={preload}
        className={styles.photo}
      />
    );
  }
  return <Illustration name={illustration} className={styles.art} />;
}
