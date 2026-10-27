"use client";

import { useEffect, useMemo, useRef, useState, useTransition, ViewTransition } from "react";
import { Illustration } from "@/components/art/Illustration";
import { useCart } from "@/components/cart/CartProvider";
import { SoftImage } from "@/components/ui/SoftImage";
import { BagIcon, CheckIcon } from "@/components/ui/icons";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { isColourOption, swatchFor } from "@/lib/commerce/presentation";
import type { Image as ImageType, Product, ProductVariant } from "@/lib/commerce/types";
import { flyToCart } from "@/lib/fly-to-cart";
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

/**
 * Gallery, options and the buy box. `perks` (shop offers) render under the
 * price and `children` (the delivery facts) under the Add to cart button. On
 * phones, a bar with the button follows the reader once the main button has
 * scrolled out of view.
 */
export function ProductDetail({
  product,
  perks,
  children,
}: {
  product: Product;
  perks?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { addItem } = useCart();
  const { dict } = useI18n();
  const t = dict.product;
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();

  const variant = product.variants.find((v) => matches(v, selection)) ?? null;
  const available = Boolean(variant?.availableForSale);

  const buyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [justAdded, setJustAdded] = useState(false);
  const add = () =>
    variant &&
    startTransition(async () => {
      if (await addItem(variant.id, quantity)) {
        flyToCart(stageRef.current);
        setQuantity(1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1600);
      }
    });
  const addLabel = !variant
    ? t.chooseOption
    : !available
      ? t.soldOut
      : pending
        ? t.adding
        : justAdded
          ? t.added
          : t.addToCart;
  const price = variant ? (
    <Price min={variant.price} compareAt={variant.compareAtPrice} />
  ) : (
    <Price min={product.priceRange.minVariantPrice} max={product.priceRange.maxVariantPrice} />
  );

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

  // Phones: swipe the big photo to the next or previous one (direction drives the slide-in).
  const activeIndex = Math.max(0, images.findIndex((i) => i.url === active?.url));
  const [slide, setSlide] = useState<"next" | "prev" | null>(null);
  const show = (index: number, dir: "next" | "prev") => {
    const img = images[(index + images.length) % images.length];
    if (!img) return;
    setSlide(dir);
    setActiveUrl(img.url);
  };
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(activeIndex + (dx < 0 ? 1 : -1), dx < 0 ? "next" : "prev");
  };

  // Computers: the photo zooms in under the mouse. Written straight to the
  // element so moving the mouse doesn't re-render the page.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--zoom-x", `${((e.clientX - box.left) / box.width) * 100}%`);
    e.currentTarget.style.setProperty("--zoom-y", `${((e.clientY - box.top) / box.height) * 100}%`);
    e.currentTarget.dataset.zoom = "on";
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    delete e.currentTarget.dataset.zoom;
  };

  const hasValue = (v: ProductVariant, name: string, value: string) =>
    v.selectedOptions.some((o) => o.name === name && o.value === value);

  // If the new value doesn't come with the other current choices (e.g. a colour
  // only made in one size), switch to the closest variant that has it.
  const choose = (name: string, value: string) => {
    const next = { ...selection, [name]: value };
    if (!product.variants.some((v) => v.availableForSale && matches(v, next))) {
      const shared = (v: ProductVariant) => v.selectedOptions.filter((o) => next[o.name] === o.value).length;
      const closest = product.variants
        .filter((v) => v.availableForSale && hasValue(v, name, value))
        .sort((a, b) => shared(b) - shared(a))[0];
      if (closest) Object.assign(next, Object.fromEntries(closest.selectedOptions.map((o) => [o.name, o.value])));
    }
    setSelection(next);
    setSlide(null);
    setActiveUrl(null);
  };

  // A value is selectable if some available variant has it.
  const isValueAvailable = (name: string, value: string) =>
    product.variants.some((v) => v.availableForSale && hasValue(v, name, value));

  return (
    <div className={styles.layout}>
      <div className={styles.gallery}>
        <div
          className={`${styles.stage} soft-frame ${product.tile}`}
          ref={stageRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          {/* Same name as the product card's photo: opening a product glides the photo here. */}
          <ViewTransition name={`product-${product.handle}`} share="morph" default="none">
            {/* The key remounts the photo when the colour or thumbnail changes, so it fades in. */}
            <span
              key={active?.url ?? "art"}
              className={styles.stageMedia}
              data-slide={slide ?? undefined}
            >
              {active ? (
                <SoftImage
                  src={active.url}
                  alt={active.altText || product.title}
                  fill
                  preload
                  quality={90}
                  sizes="(max-width: 900px) 100vw, 560px"
                  className={styles.stagePhoto}
                />
              ) : (
                <Illustration name={product.illustration} className={styles.stageArt} />
              )}
            </span>
          </ViewTransition>
          {product.badge ? <span className={styles.tag}>{product.badge}</span> : null}
        </div>
        {active?.note ? <p className={styles.photoNote}>{active.note}</p> : null}
        {images.length > 1 ? (
          <div className={styles.dots} aria-hidden="true">
            {images.map((img, i) => (
              <span key={img.url} data-active={i === activeIndex} />
            ))}
          </div>
        ) : null}
        {images.length > 1 ? (
          <ul className={styles.thumbs} aria-label={t.photos}>
            {images.map((img, i) => (
              <li key={img.url}>
                <button
                  type="button"
                  className={`${styles.thumb} soft-frame ${product.tile}`}
                  aria-pressed={img.url === active?.url}
                  aria-label={fmt(t.showPhoto, { index: i + 1, total: images.length })}
                  onClick={() => {
                    setSlide(null);
                    setActiveUrl(img.url);
                  }}
                >
                  <SoftImage src={img.url} alt="" fill sizes="80px" className={styles.stagePhoto} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className={styles.info}>
        {product.petType ? <p className="eyebrow">{product.petType}</p> : null}
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.price}>{price}</p>
        {perks}

        {product.options.map((option) => (
          <fieldset key={option.name} className={styles.option}>
            <legend>
              {option.name}
              {selection[option.name] ? (
                // The key replays a small fade when the choice changes.
                <span key={selection[option.name]} className={styles.chosen}>
                  ({selection[option.name]})
                </span>
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
                  {isColourOption(option.name) && swatchFor(value) ? (
                    <span className={styles.dot} style={{ background: swatchFor(value)! }} aria-hidden="true" />
                  ) : null}
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className={styles.buy} ref={buyRef}>
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
            className={`btn btn-gold ${styles.addBtn}`}
            disabled={!available || pending}
            onClick={add}
            data-added={justAdded || undefined}
          >
            {justAdded ? <CheckIcon /> : <BagIcon />}
            {addLabel}
          </button>
        </div>
        {children}
      </div>

      <div className={styles.stickyBar} data-visible={showBar} aria-hidden={!showBar} inert={!showBar}>
        <div className={styles.stickyInfo}>
          <b>{product.title}</b>
          <span>
            {price}
            {variant && product.options.length ? ` · ${variant.title}` : null}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-gold"
          disabled={!available || pending}
          onClick={add}
          data-added={justAdded || undefined}
        >
          {justAdded ? <CheckIcon /> : <BagIcon />}
          {addLabel}
        </button>
      </div>
    </div>
  );
}
