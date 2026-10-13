import type { Collection } from "@/lib/commerce/types";
import { CategoryCard } from "./CategoryCard";
import styles from "./CategoryCard.module.css";

export function CategoryGrid({ collections }: { collections: Collection[] }) {
  return (
    <div className={styles.cats}>
      {collections.map((c) => (
        <CategoryCard key={c.id} collection={c} />
      ))}
    </div>
  );
}
