"use client";

import Link from "next/link";
import { useId, useRef, useState, useTransition, type ReactNode } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/product/Price";
import { ProductMedia } from "@/components/product/ProductMedia";
import { CheckIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/I18nProvider";
import { isColourOption, isSizeOption, swatchFor } from "@/lib/commerce/presentation";
import type { Image, Product, ProductVariant } from "@/lib/commerce/types";
import { flyToCart } from "@/lib/fly-to-cart";
import styles from "./Day.module.css";

type Selection = Record<string, string>;

const matches = (v: ProductVariant, sel: Selection) =>
  v.selectedOptions.every((o) => sel[o.name] === o.value);
const has = (v: ProductVariant, name: string, value: string) =>
  v.selectedOptions.some((o) => o.name === name && o.value === value);

/** Just what a product needs to be chosen and bought from the home page. */
export type DayProductData = Pick<
  Product,
  "handle" | "title" | "badge" | "petType" | "illustration" | "featuredImage" | "options" | "variants"
>;

type Props = {
  product: DayProductData;
  /** "plate": a white card, side by side with others. "feature": a large photo beside the text. */
  layout: "plate" | "feature";
  /** Feature only: photo on the right. */
  flip?: boolean;
  /** "No. 01" */
  number: string;
  /** A photo of the product at home, shown until a colour is picked. */
  scene?: Image | null;
  /** The real measurements, from the product's size chart. */
  measurements: string | null;
  href: string;
  /** Feature only: the chapter's eyebrow, headline and paragraph, above the product name. */
  intro?: ReactNode;
};

/**
 * A product inside the day's story, ready to buy where it stands: the colour
 * dots change the photo, sizes are one tap, and Add to cart works right here.
 */
export function DayProduct({ product, layout, flip, number, scene, measurements, href, intro }: Props) {
  const { dict } = useI18n();
  const t = dict.product;
  const h = dict.home;
  const { addItem } = useCart();
  const id = useId();
  const [sel, setSel] = useState<Selection>(() => {
    const v = product.variants.find((x) => x.availableForSale) ?? product.variants[0];
    return Object.fromEntries((v?.selectedOptions ?? []).map((o) => [o.name, o.value]));
  });
  // Until a colour is picked, the photo of the product at home stays up.
  const [picked, setPicked] = useState(false);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const pic = useRef<HTMLDivElement>(null);

  const variant = product.variants.find((v) => matches(v, sel)) ?? null;
  const colour = product.options.find((o) => isColourOption(o.name));
  const variantImage =
    variant?.image ??
    (colour
      ? product.variants.find((v) => v.image && has(v, colour.name, sel[colour.name]))?.image
      : null) ??
    null;
  const image = (!picked && scene) || variantImage || scene || product.featuredImage;

  const choose = (name: string, value: string) => {
    const next = { ...sel, [name]: value };
    // A combination that isn't sold switches to the closest one that is.
    if (!product.variants.some((v) => v.availableForSale && matches(v, next))) {
      const close = product.variants.find((v) => v.availableForSale && has(v, name, value));
      if (close) Object.assign(next, Object.fromEntries(close.selectedOptions.map((o) => [o.name, o.value])));
    }
    if (isColourOption(name)) setPicked(true);
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

  const photo = (
    <div
      ref={pic}
      className={layout === "plate" ? styles.platePic : `${styles.big}${flip ? ` ${styles.bigFlip}` : ""}`}
      data-drift
    >
      {/* Stays put while the photo inside changes, so the scroll drift carries on. */}
      <div className={styles.layer} data-drift-layer>
        {/* The key remounts the photo on a colour change, so it fades in. */}
        <span key={image?.url ?? "art"} className={styles.media}>
          <ProductMedia
            image={image}
            illustration={product.illustration}
            alt={product.title}
            sizes={layout === "plate" ? "(max-width: 760px) 100vw, 560px" : "(max-width: 900px) 100vw, 640px"}
          />
        </span>
      </div>
      {layout === "plate" ? (
        <>
          <span className={`mono ${styles.no}`}>{number}</span>
          {product.badge ? <span className={`mono ${styles.flag}`}>{product.badge}</span> : null}
        </>
      ) : null}
    </div>
  );

  const specs = (
    <dl className={styles.specs}>
      {product.petType ? (
        <div className={styles.specRow}>
          <dt>{h.specFor}</dt>
          <dd>{product.petType}</dd>
        </div>
      ) : null}
      {product.options
        .filter((o) => o.values.length > 1)
        .map((o, i) => {
          const isColour = isColourOption(o.name);
          const label = `${id}-o${i}`;
          return (
            <div key={o.name} className={styles.specRow}>
              <dt id={label}>{o.name}</dt>
              <dd>
                <div role="group" aria-labelledby={label} className={styles.choices}>
                  {o.values.map((value) => {
                    const shade = isColour ? swatchFor(value) : null;
                    const sold = !product.variants.some((v) => v.availableForSale && has(v, o.name, value));
                    return (
                      <button
                        key={value}
                        type="button"
                        className={shade ? styles.dot : styles.size}
                        style={shade ? ({ "--shade": shade } as React.CSSProperties) : undefined}
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
                  {isColour ? <span className={styles.chosen}>{sel[o.name]}</span> : null}
                </div>
                {measurements && isSizeOption(o.name) ? <p className={styles.measure}>{measurements}</p> : null}
              </dd>
            </div>
          );
        })}
    </dl>
  );

  const buy = (
    <div className={styles.buy}>
      <div className={styles.priceBox}>
        <Price
          min={variant?.price ?? product.variants[0]?.price}
          compareAt={variant?.compareAtPrice}
          className={styles.price}
        />
        <Link href={href} className={styles.details}>
          {h.details} →
        </Link>
      </div>
      <button
        type="button"
        className="btn btn-gold"
        onClick={add}
        disabled={pending || !variant?.availableForSale}
        data-added={added || undefined}
      >
        {added ? <CheckIcon /> : null}
        {!variant?.availableForSale ? t.soldOut : pending ? t.adding : added ? t.added : t.addToCart}
      </button>
    </div>
  );

  const anchor = `no-${number.replace(/\D/g, "")}`;
  if (layout === "plate") {
    return (
      <article className={styles.plate} id={anchor}>
        {photo}
        <h3 className={styles.plateTitle}>
          <Link href={href}>{product.title}</Link>
        </h3>
        {specs}
        {buy}
      </article>
    );
  }
  return (
    <article className={`${styles.feature}${flip ? ` ${styles.flip}` : ""}`} id={anchor}>
      {photo}
      <div className={styles.featureText}>
        {intro}
        <h3 className={styles.featureTitle}>
          <span className={`mono ${styles.featureNo}`}>{number}</span>
          <Link href={href}>{product.title}</Link>
        </h3>
        {specs}
        {buy}
      </div>
    </article>
  );
}
