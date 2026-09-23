import type { ProductSummary } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div className={styles.products}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} preload={i < 2} />
      ))}
    </div>
  );
}
