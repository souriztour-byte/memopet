import type { ProductSummary } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  // A small catalog gets bigger cards instead of an empty fourth column.
  const className = products.length <= 3 ? `${styles.products} ${styles.few}` : styles.products;
  return (
    <div className={className}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} preload={i < 2} />
      ))}
    </div>
  );
}
