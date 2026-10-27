"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/product/Price";
import { ProductMedia } from "@/components/product/ProductMedia";
import { CheckIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/I18nProvider";
import { flyToCart } from "@/lib/fly-to-cart";
import { isColourOption, swatchFor } from "@/lib/commerce/presentation";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import styles from "./FeaturedProduct.module.css";

type Selection = Record<string, string>;

const matches = (v: ProductVariant, sel: Selection) =>
  v.selectedOptions.every((o) => sel[o.name] === o.value);
const has = (v: ProductVariant, name: string, value: string) =>
  v.selectedOptions.some((o) => o.name === name && o.value === value);

/**
 * The bestseller on the home page, ready to buy: the colour dots change the
 * photo, sizes are one tap, and Add to cart works right here.
 */
export function FeaturedProduct({
  product,
  eyebrow,
  lead,
  detailsHref,
  detailsLabel,
}: {
  product: Product;
  eyebrow: string;
  lead: string;
  detailsHref: string;
  detailsLabel: string;
}) {
  const { dict } = useI18n();
  const t = dict.product;
  const { addItem } = useCart();
  const [sel, setSel] = useState<Selection>(() => {
    const v =
      product.variants.find((x) => x.availableForSale) ?? product.variants[0];
    return Object.fromEntries(
      (v?.selectedOptions ?? []).map((o) => [o.name, o.value]),
    );
  });
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const pic = useRef<HTMLDivElement>(null);

  const variant = product.variants.find((v) => matches(v, sel)) ?? null;
  const colour = product.options.find((o) => isColourOption(o.name));
  // The photo follows the chosen colour, whatever the size.
  const image =
    variant?.image ??
    (colour
      ? product.variants.find(
          (v) => v.image && has(v, colour.name, sel[colour.name]),
        )?.image
      : null) ??
    product.featuredImage;

  const choose = (name: string, value: string) => {
    const next = { ...sel, [name]: value };
    // A combination that isn't sold switches to the closest one that is.
    if (!product.variants.some((v) => v.availableForSale && matches(v, next))) {
      const close = product.variants.find(
        (v) => v.availableForSale && has(v, name, value),
      );
      if (close)
        Object.assign(
          next,
          Object.fromEntries(
            close.selectedOptions.map((o) => [o.name, o.value]),
          ),
        );
    }
    setSel(next);
  };
  const add = () => {
    if (!variant) return;
    startTransition(async () => {
      if (await addItem(variant.id, 1)) {
        flyToCart(pic.current);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }
    });
  };

  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <div ref={pic} className={styles.pic} data-drift>
        {/* Stays put while the photo inside changes, so the scroll drift carries on. */}
        <div className={styles.layer} data-drift-layer>
          {/* The key remounts the photo on a colour change, so it fades and settles in. */}
          <span key={image?.url ?? "art"} className={styles.media}>
            <ProductMedia
              image={image}
              illustration={product.illustration}
              alt={product.title}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </span>
        </div>
        {colour ? (
          <span
            className={styles.colourName}
            aria-hidden="true"
            key={sel[colour.name]}
          >
            {sel[colour.name]}
          </span>
        ) : null}
      </div>

      <div className={styles.buy}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="featured-title" className={styles.title} data-rise>
          {product.title}
        </h2>
        <p className={styles.lead}>{lead}</p>
        <Price
          min={variant?.price ?? product.priceRange.minVariantPrice}
          compareAt={variant?.compareAtPrice}
          className={styles.price}
        />

        {product.options
          .filter((o) => o.values.length > 1)
          .map((o) => {
            const isColour = isColourOption(o.name);
            return (
              <fieldset key={o.name} className={styles.option}>
                <legend>
                  {o.name}: <b>{sel[o.name]}</b>
                </legend>
                <div className={isColour ? styles.dots : styles.pills}>
                  {o.values.map((value) => {
                    const shade = isColour ? swatchFor(value) : null;
                    const sold = !product.variants.some(
                      (v) => v.availableForSale && has(v, o.name, value),
                    );
                    return (
                      <button
                        key={value}
                        type="button"
                        className={shade ? styles.dot : styles.pill}
                        style={
                          shade
                            ? ({ "--shade": shade } as React.CSSProperties)
                            : undefined
                        }
                        aria-pressed={sel[o.name] === value}
                        aria-label={shade ? value : undefined}
                        title={shade ? value : undefined}
                        disabled={sold}
                        onClick={() => choose(o.name, value)}
                      >
                        {shade ? null : value}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-gold"
            onClick={add}
            disabled={pending || !variant?.availableForSale}
            data-added={added || undefined}
          >
            {added ? <CheckIcon /> : null}
            {!variant?.availableForSale
              ? t.soldOut
              : pending
                ? t.adding
                : added
                  ? t.added
                  : t.addToCart}
          </button>
          <Link href={detailsHref} className={styles.details}>
            {detailsLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
