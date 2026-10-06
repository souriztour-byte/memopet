import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import type { ProductSummary } from "@/lib/commerce/types";
import { Price } from "./Price";
import { ProductMedia } from "./ProductMedia";
import { QuickAdd } from "./QuickAdd";
import styles from "./ProductCard.module.css";

export async function ProductCard({ product, preload }: { product: ProductSummary; preload?: boolean }) {
  const { lang, dict } = await getI18n();
  const href = localizePath(lang, `/products/${product.handle}`);
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
        {!product.availableForSale ? <span className={styles.tag}>{dict.product.soldOut}</span> : null}
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
            <Link
              href={href}
              className={styles.add}
              aria-label={fmt(dict.product.optionsLabel, { title: product.title })}
            >
              {dict.product.options} <ArrowIcon />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
