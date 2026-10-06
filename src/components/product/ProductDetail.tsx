"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { Illustration } from "@/components/art/Illustration";
import { useCart } from "@/components/cart/CartProvider";
import { BagIcon } from "@/components/ui/icons";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import type { Image as ImageType, Product, ProductVariant } from "@/lib/commerce/types";
import { MAX_QTY } from "@/lib/limits";
import { Price } from "./Price";
import styles from "./ProductDetail.module.css";

type Selection = Record<string, string>;

const matches = (variant: ProductVariant, selection: Selection) =>
  variant.selectedOptions.every((o) => selection[o.name] === o.value);

function initialSelection(product: Product): Selection {
  const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  return Object.fromEntries((variant?.selectedOptions ?? []).map((o) => [o.name, o.value]));
}

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { dict } = useI18n();
  const t = dict.product;
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();

  const variant = product.variants.find((v) => matches(v, selection)) ?? null;
  const available = Boolean(variant?.availableForSale);

  // Photos: the selected variant's photo first, then the rest.
  const images = useMemo(() => {
    const list: ImageType[] = [...product.images];
    const vImg = variant?.image;
    if (vImg && !list.some((i) => i.url === vImg.url)) list.unshift(vImg);
    return list;
  }, [product.images, variant?.image]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const active =
    images.find((i) => i.url === activeUrl) ??
    images.find((i) => i.url === variant?.image?.url) ??
    images[0] ??
    null;

  const choose = (name: string, value: string) => {
    setSelection((s) => ({ ...s, [name]: value }));
    setActiveUrl(null);
  };

  // A value is selectable if some available variant has it together with the other current choices.
  const isValueAvailable = (name: string, value: string) =>
    product.variants.some(
      (v) => v.availableForSale && matches(v, { ...selection, [name]: value }),
    );

  return (
    <div className={styles.layout}>
      <div className={styles.gallery}>
        <div className={`${styles.stage} ${product.tile}`}>
          {active ? (
            <Image
              src={active.url}
              alt={active.altText || product.title}
              fill
              preload
              sizes="(max-width: 900px) 100vw, 560px"
              className={styles.stagePhoto}
            />
          ) : (
            <Illustration name={product.illustration} className={styles.stageArt} />
          )}
          {product.badge ? <span className={styles.tag}>{product.badge}</span> : null}
        </div>
        {images.length > 1 ? (
          <ul className={styles.thumbs} aria-label={t.photos}>
            {images.map((img, i) => (
              <li key={img.url}>
                <button
                  type="button"
                  className={`${styles.thumb} ${product.tile}`}
                  aria-pressed={img.url === active?.url}
                  aria-label={fmt(t.showPhoto, { index: i + 1, total: images.length })}
                  onClick={() => setActiveUrl(img.url)}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className={styles.stagePhoto} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className={styles.info}>
        {product.petType ? <p className="eyebrow">{product.petType}</p> : null}
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>
          {variant ? (
            <Price min={variant.price} compareAt={variant.compareAtPrice} />
          ) : (
            <Price min={product.priceRange.minVariantPrice} max={product.priceRange.maxVariantPrice} />
          )}
        </p>

        {product.options.map((option) => (
          <fieldset key={option.name} className={styles.option}>
            <legend>
              {option.name}
              {selection[option.name] ? (
                <span className={styles.chosen}> ({selection[option.name]})</span>
              ) : null}
            </legend>
            <div className={styles.values} role="radiogroup" aria-label={option.name}>
              {option.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  className="pill"
                  aria-checked={selection[option.name] === value}
                  disabled={!isValueAvailable(option.name, value)}
                  onClick={() => choose(option.name, value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className={styles.buy}>
          <div className={styles.qtyWrap}>
            <span className={styles.qtyLabel} id="qty-label">
              {t.quantity}
            </span>
            <span className={`qty ${styles.qty}`} role="group" aria-labelledby="qty-label">
              <button
                type="button"
                aria-label={t.decrease}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <output aria-live="polite">{quantity}</output>
              <button
                type="button"
                aria-label={t.increase}
                onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                disabled={quantity >= MAX_QTY}
              >
                +
              </button>
            </span>
          </div>
          <button
            type="button"
            className={`btn btn-pink ${styles.addBtn}`}
            disabled={!available || pending}
            onClick={() =>
              variant &&
              startTransition(async () => {
                if (await addItem(variant.id, quantity)) setQuantity(1);
              })
            }
          >
            <BagIcon />
            {!variant ? t.chooseOption : !available ? t.soldOut : pending ? t.adding : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
