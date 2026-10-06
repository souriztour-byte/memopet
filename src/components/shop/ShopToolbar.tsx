"use client";

import Form from "next/form";
import Link from "next/link";
import { useRef } from "react";
import { localizePath, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { SORT_OPTIONS } from "@/lib/commerce/sort";
import type { ProductSort } from "@/lib/commerce/types";
import styles from "./ShopToolbar.module.css";

type Props = {
  query: string;
  sort: ProductSort;
  category: string | null;
  categories: { handle: string; title: string }[];
};

function shopHref(lang: Locale, params: { q?: string; sort?: string; category?: string | null }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "featured") sp.set("sort", params.sort);
  if (params.category) sp.set("category", params.category);
  const s = sp.toString();
  const path = localizePath(lang, "/shop");
  return s ? `${path}?${s}` : path;
}

/** Search, sort and category filters, kept in the URL so results are shareable. */
export function ShopToolbar({ query, sort, category, categories }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const { lang, dict } = useI18n();
  const t = dict.shop;
  return (
    <>
      <Form action={localizePath(lang, "/shop")} ref={formRef} className={styles.toolbar} role="search">
        <label className="sr-only" htmlFor="shop-search">
          {t.searchLabel}
        </label>
        <input
          id="shop-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder={t.searchPlaceholder}
        />
        <label className="sr-only" htmlFor="shop-sort">
          {t.sortLabel}
        </label>
        <select
          id="shop-sort"
          name="sort"
          defaultValue={sort}
          onChange={() => formRef.current?.requestSubmit()}
        >
          {SORT_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {dict.sort[value]}
            </option>
          ))}
        </select>
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <button type="submit" className="btn btn-purple btn-sm">
          {t.searchButton}
        </button>
      </Form>
      <div className={styles.filters} role="group" aria-label={t.filterLabel}>
        <Link
          href={shopHref(lang, { q: query, sort })}
          className="pill"
          aria-current={!category ? "page" : undefined}
        >
          {t.filterAll}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.handle}
            href={shopHref(lang, { q: query, sort, category: c.handle })}
            className="pill"
            aria-current={category === c.handle ? "page" : undefined}
          >
            {c.title}
          </Link>
        ))}
      </div>
    </>
  );
}
