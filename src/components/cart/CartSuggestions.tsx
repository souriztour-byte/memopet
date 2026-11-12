"use client";

import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Price } from "@/components/product/Price";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { pairsWith } from "@/lib/commerce/presentation";
import type { Cart } from "@/lib/commerce/types";
import { useCart } from "./CartProvider";
import styles from "./Cart.module.css";

/**
 * Two products that go with what's in the cart. With an empty cart (`cart`
 * null), two from the collection, so the cart is never a dead end.
 */
export function CartSuggestions({ cart, onNavigate }: { cart: Cart | null; onNavigate?: () => void }) {
  const { lang, dict } = useI18n();
  const { suggestions } = useCart();
  const lines = cart?.lines ?? [];
  const picks = pairsWith(
    suggestions,
    lines.map((l) => l.merchandise.product),
    2,
  );
  if (!picks.length) return null;
  return (
    <section className={styles.suggest} aria-labelledby="suggest-title">
      <h3 id="suggest-title" className={styles.suggestTitle}>
        {lines.length ? dict.product.relatedEyebrow : dict.header.searchPopular}
      </h3>
      <ul>
        {picks.map((p) => (
          <li key={p.id}>
            <Link href={localizePath(lang, `/products/${p.handle}`)} className={styles.suggestItem} onClick={onNavigate}>
              <span className={`${styles.thumb} ${p.tile}`}>
                <ProductMedia image={p.featuredImage} illustration={p.illustration} alt={p.title} sizes="64px" />
              </span>
              <span className={styles.info}>
                <span className={styles.name}>{p.title}</span>
                <Price className={styles.meta} min={p.priceRange.minVariantPrice} max={p.priceRange.maxVariantPrice} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
