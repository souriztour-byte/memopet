import type { ProductSummary } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

/**
 * `rail`: on phones the cards become a row you swipe sideways (home page)
 * instead of wrapping into rows.
 */
export function ProductGrid({ products, rail }: { products: ProductSummary[]; rail?: boolean }) {
  // A small catalog gets bigger cards instead of an empty fourth column,
  // and four products wrap as two rows of two rather than three and one.
  const size = products.length <= 3 ? styles.few : products.length === 4 ? styles.four : "";
  return (
    <div className={[styles.products, size, rail ? styles.rail : ""].filter(Boolean).join(" ")} data-reveal>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} preload={i < 2} />
      ))}
    </div>
  );
}
