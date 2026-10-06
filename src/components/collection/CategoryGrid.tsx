import { getI18n } from "@/i18n/server";
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

export async function PhotoCredit() {
  const { dict } = await getI18n();
  return (
    <p className="photo-credit">
      {dict.photos.credit}{" "}
      <a href="https://unsplash.com/photos/RR9yB4GWvzA" target="_blank" rel="noopener noreferrer">
        Natasha Connell
      </a>
      ,{" "}
      <a href="https://unsplash.com/photos/OT_GibNdE64" target="_blank" rel="noopener noreferrer">
        Ottr Dan
      </a>
      .
    </p>
  );
}
