"use client";

import Link from "next/link";
import { useRef, useState, useTransition, ViewTransition } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, PlusIcon } from "@/components/ui/icons";
import { localizePath } from "@/i18n/config";
import { flyToCart } from "@/lib/fly-to-cart";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { isColourOption, swatchFor } from "@/lib/commerce/presentation";
import type { ProductSummary, ProductVariant } from "@/lib/commerce/types";
import { Price } from "./Price";
import { ProductMedia } from "./ProductMedia";
import styles from "./ProductCard.module.css";

type Selection = Record<string, string>;

const matches = (v: ProductVariant, sel: Selection) =>
  Object.entries(sel).every(([name, value]) => v.selectedOptions.some((o) => o.name === name && o.value === value));

/**
 * Card with colour swatches (they switch the photo) and a quick add. When the
 * product has other choices, such as size, quick add opens a small picker on
 * the photo; choosing the last one adds the item.
 */
export function ProductCard({ product, preload }: { product: ProductSummary; preload?: boolean }) {
  const { lang, dict } = useI18n();
  const { addItem } = useCart();
  const t = dict.product;
  const href = localizePath(lang, `/products/${product.handle}`);

  const colour = product.options.find((o) => isColourOption(o.name)) ?? null;
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<Selection>({});
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const picRef = useRef<HTMLDivElement>(null);

  const available = (s: Selection) => product.variants.some((v) => v.availableForSale && matches(v, s));
  const colourImage = picked
    ? product.variants.find((v) => v.image && matches(v, { [colour!.name]: picked }))?.image
    : null;
  const image = colourImage ?? product.featuredImage;
  // A second photo that fades in on hover (computers): another colour's photo.
  const hoverImage = picked
    ? null
    : (product.variants.find((v) => v.image && v.image.url !== product.featuredImage?.url)?.image ?? null);

  const add = (variantId: string) =>
    startTransition(async () => {
      if (await addItem(variantId, 1)) {
        flyToCart(picRef.current);
        setOpen(false);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }
    });

  // Options with one value are chosen already; the picked swatch counts too.
  const start = (): Selection => {
    const s: Selection = {};
    for (const o of product.options) if (o.values.length === 1) s[o.name] = o.values[0];
    if (colour && picked) s[colour.name] = picked;
    return s;
  };
  const choose = (name: string, value: string) => {
    const next = { ...sel, [name]: value };
    setSel(next);
    const variant = product.variants.find((v) => v.availableForSale && matches(v, next));
    if (variant && Object.keys(next).length === product.options.length) add(variant.id);
  };
  const quickAdd = () => {
    if (product.singleVariantId) return add(product.singleVariantId);
    const s = start();
    const variant = product.variants.find((v) => v.availableForSale && matches(v, s));
    if (variant && Object.keys(s).length === product.options.length) return add(variant.id);
    setSel(s);
    setOpen(true);
  };

  return (
    <article className={`${styles.prod} ${product.tile}`}>
      <div className={styles.pic} ref={picRef}>
        {/* Same name as the product page's main photo, so opening the product glides it there. */}
        <ViewTransition name={`product-${product.handle}`} share="morph" default="none">
          {/* The key remounts the photo when a swatch changes it, so it fades in. */}
          <span key={image?.url ?? "art"} className={styles.media}>
            <ProductMedia
              image={image}
              illustration={product.illustration}
              alt={product.title}
              sizes="(max-width: 720px) 70vw, (max-width: 1000px) 33vw, 320px"
              preload={preload}
            />
          </span>
        </ViewTransition>
        {hoverImage ? (
          <span className={`${styles.media} ${styles.hoverMedia}`} aria-hidden="true">
            <ProductMedia image={hoverImage} illustration={product.illustration} alt="" sizes="(max-width: 1000px) 33vw, 320px" />
          </span>
        ) : null}
        {product.badge ? <span className={styles.tag}>{product.badge}</span> : null}
        {!product.availableForSale ? <span className={styles.tag}>{t.soldOut}</span> : null}

        {product.availableForSale ? (
          <button
            type="button"
            className={styles.add}
            onClick={open ? () => setOpen(false) : quickAdd}
            disabled={pending}
            aria-expanded={product.singleVariantId ? undefined : open}
            aria-label={fmt(t.quickAddLabel, { title: product.title })}
          >
            {done ? <CheckIcon /> : <PlusIcon />}
            <span>{done ? dict.cart.added : t.quickAddOpen}</span>
          </button>
        ) : null}

        {open ? (
          <div className={styles.picker} role="group" aria-label={fmt(t.optionsLabel, { title: product.title })}>
            {product.options
              .filter((o) => o.values.length > 1)
              .map((o) => (
                <div key={o.name} className={styles.pickRow}>
                  <span className={styles.pickName}>{o.name}</span>
                  <span className={styles.pickValues}>
                    {o.values.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={styles.pickValue}
                        aria-pressed={sel[o.name] === value}
                        disabled={pending || !available({ ...sel, [o.name]: value })}
                        onClick={() => choose(o.name, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </span>
                </div>
              ))}
          </div>
        ) : null}
      </div>

      <div className={styles.body}>
        {product.petType ? <span className={styles.for}>{product.petType}</span> : null}
        <h3>
          <Link href={href} className={styles.link}>
            {product.title}
          </Link>
        </h3>
        <Price
          min={product.priceRange.minVariantPrice}
          max={product.priceRange.maxVariantPrice}
          className={styles.price}
        />
        {colour && colour.values.length > 1 ? (
          <ul className={styles.swatches} aria-label={colour.name}>
            {colour.values.map((value) => {
              const shade = swatchFor(value);
              return (
                <li key={value}>
                  <button
                    type="button"
                    className={shade ? styles.swatch : styles.swatchText}
                    style={shade ? { background: shade } : undefined}
                    aria-pressed={picked === value}
                    aria-label={fmt(t.showColour, { colour: value })}
                    title={value}
                    onClick={() => setPicked(value)}
                  >
                    {shade ? null : value}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
