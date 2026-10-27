"use client";

import Form from "next/form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Price } from "@/components/product/Price";
import { ProductMedia } from "@/components/product/ProductMedia";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { OPEN_SEARCH_EVENT } from "./open-search";
import styles from "./SearchOverlay.module.css";

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Search panel that drops down over the page: results from the catalogue
 * appear as you type, and Enter opens the full results in the shop. Built on
 * a native <dialog>, so focus stays inside and Esc closes it.
 */
export function SearchOverlay() {
  const { lang, dict } = useI18n();
  const t = dict.header;
  const { suggestions: catalogue } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const open = () => {
      const dialog = ref.current;
      if (!dialog || dialog.open) return;
      setClosing(false);
      dialog.showModal();
      document.body.style.overflow = "hidden";
      input.current?.focus();
    };
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, open);
  }, []);

  const finish = () => {
    ref.current?.close();
    setClosing(false);
    document.body.style.overflow = "";
  };
  // Slides back up before closing; at once with reduced motion.
  const close = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    setClosing(true);
    setTimeout(finish, 260);
  };

  const words = normalise(query).split(/\s+/).filter(Boolean);
  const matches = words.length
    ? catalogue.filter((p) => {
        const hay = normalise(`${p.title} ${p.petType ?? ""}`);
        return words.every((w) => hay.includes(w));
      })
    : catalogue;
  const shown = matches.slice(0, 6);
  const shopHref = localizePath(lang, "/shop");

  return (
    <dialog
      ref={ref}
      className={styles.overlay}
      data-closing={closing || undefined}
      aria-label={t.searchTitle}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      // A search box uses Esc to clear itself; here Esc always closes.
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className={styles.panel}>
        <div className={`wrap ${styles.inner}`}>
          <Form action={shopHref} className={styles.form} role="search" onSubmit={finish}>
            <label htmlFor="overlay-search" className="sr-only">
              {dict.shop.searchLabel}
            </label>
            <input
              ref={input}
              id="overlay-search"
              name="q"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.shop.searchPlaceholder}
              className={styles.input}
            />
            <button type="button" className={styles.close} onClick={close} aria-label={t.searchClose}>
              ×
            </button>
          </Form>

          <p className={styles.label} aria-live="polite">
            {words.length ? (shown.length ? t.searchResults : fmt(t.searchNone, { query })) : t.searchPopular}
          </p>
          <ul className={styles.results}>
            {shown.map((p, i) => (
              <li key={p.id} style={{ "--i": i } as React.CSSProperties}>
                <Link href={localizePath(lang, `/products/${p.handle}`)} className={styles.result} onClick={finish}>
                  <span className={`${styles.thumb} ${p.tile}`}>
                    <ProductMedia image={p.featuredImage} illustration={p.illustration} alt="" sizes="72px" />
                  </span>
                  <span className={styles.text}>
                    <b>{p.title}</b>
                    <Price min={p.priceRange.minVariantPrice} max={p.priceRange.maxVariantPrice} className={styles.price} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {words.length ? (
            <Link href={`${shopHref}?q=${encodeURIComponent(query.trim())}`} className={styles.all} onClick={finish}>
              {fmt(t.searchAll, { query: query.trim() })} →
            </Link>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
