"use client";

import Form from "next/form";
import Link from "next/link";
import { useRef } from "react";
import { SORT_OPTIONS } from "@/lib/commerce/sort";
import type { ProductSort } from "@/lib/commerce/types";
import styles from "./ShopToolbar.module.css";

type Props = {
  query: string;
  sort: ProductSort;
  category: string | null;
  categories: { handle: string; title: string }[];
};

function shopHref(params: { q?: string; sort?: string; category?: string | null }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "featured") sp.set("sort", params.sort);
  if (params.category) sp.set("category", params.category);
  const s = sp.toString();
  return s ? `/shop?${s}` : "/shop";
}

/** Search, sort and category filters, kept in the URL so results are shareable. */
export function ShopToolbar({ query, sort, category, categories }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <>
      <Form action="/shop" ref={formRef} className={styles.toolbar} role="search">
        <label className="sr-only" htmlFor="shop-search">
          Search products
        </label>
        <input
          id="shop-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search for the paw washer, beds…"
        />
        <label className="sr-only" htmlFor="shop-sort">
          Sort products
        </label>
        <select
          id="shop-sort"
          name="sort"
          defaultValue={sort}
          onChange={() => formRef.current?.requestSubmit()}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <button type="submit" className="btn btn-purple btn-sm">
          Search
        </button>
      </Form>
      <div className={styles.filters} role="group" aria-label="Filter by category">
        <Link
          href={shopHref({ q: query, sort })}
          className="pill"
          aria-current={!category ? "page" : undefined}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.handle}
            href={shopHref({ q: query, sort, category: c.handle })}
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
