import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import type { ProductSummary } from "@/lib/commerce/types";
import { Price } from "./Price";
import { ProductMedia } from "./ProductMedia";
import { QuickAdd } from "./QuickAdd";
import styles from "./ProductCard.module.css";

export function ProductCard({ product, preload }: { product: ProductSummary; preload?: boolean }) {
  const href = `/products/${product.handle}`;
  return (
    <article className={`${styles.prod} ${product.tile}`}>
      <div className={styles.pic}>
        <ProductMedia
          image={product.featuredImage}
          illustration={product.illustration}
          alt={product.title}
          sizes="(max-width: 720px) 50vw, (max-width: 1000px) 33vw, 280px"
          preload={preload}
        />
        {product.badge ? <span className={styles.tag}>{product.badge}</span> : null}
        {!product.availableForSale ? <span className={styles.tag}>Sold out</span> : null}
      </div>
      <div className={styles.body}>
        {product.petType ? <span className={styles.for}>{product.petType}</span> : null}
        <h3>
          <Link href={href} className={styles.link}>
            {product.title}
          </Link>
        </h3>
        <div className={styles.row}>
          <Price
            min={product.priceRange.minVariantPrice}
            max={product.priceRange.maxVariantPrice}
            className={styles.price}
          />
          {product.singleVariantId ? (
            <QuickAdd
              merchandiseId={product.singleVariantId}
              title={product.title}
              className={styles.add}
              okClassName={styles.ok}
            />
          ) : product.availableForSale ? (
            <Link href={href} className={styles.add} aria-label={`Choose options for ${product.title}`}>
              Options <ArrowIcon />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
