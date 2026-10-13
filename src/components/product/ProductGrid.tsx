import type { ProductSummary } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  // A small catalog gets bigger cards instead of an empty fourth column,
  // and four products wrap as two rows of two rather than three and one.
  const size = products.length <= 3 ? styles.few : products.length === 4 ? styles.four : "";
  return (
    <div className={`${styles.products} ${size}`.trim()}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} preload={i < 2} />
      ))}
    </div>
  );
}
