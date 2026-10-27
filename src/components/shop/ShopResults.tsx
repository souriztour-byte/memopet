"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { fmt, plural } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { isFor, petsFor, type Pet } from "@/lib/commerce/pets";
import type { ProductSummary } from "@/lib/commerce/types";
import styles from "./ShopResults.module.css";

/**
 * The shop's products with an All / Dogs / Cats switch. Switching keeps the
 * search and sort from the URL, and the cards re-enter one after another.
 */
export function ShopResults({ products, query }: { products: ProductSummary[]; query: string }) {
  const { lang, dict } = useI18n();
  const t = dict.shop;
  const h = dict.home;
  const [pet, setPet] = useState<Pet>("all");
  const [switched, setSwitched] = useState(false);
  const pets = petsFor(products);
  const shown = products.filter((p) => isFor(p, pet));

  return (
    <>
      <div className={styles.row}>
        <p className="small" aria-live="polite">
          {plural(lang, shown.length, t.count)}
          {query ? <> {fmt(t.forQuery, { query })}</> : null}
        </p>
        {pets.length > 1 ? (
          <div role="group" aria-label={h.petLabel} className={styles.switch}>
            {pets.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={pet === p}
                onClick={() => {
                  setPet(p);
                  setSwitched(true);
                }}
              >
                {p === "all" ? h.petAll : p === "dogs" ? h.petDogs : h.petCats}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div key={pet} className={switched ? styles.switched : undefined}>
        <ProductGrid products={shown} />
      </div>
    </>
  );
}
