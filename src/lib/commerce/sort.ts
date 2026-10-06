import type { ProductSort } from "./types";

/** Sort choices offered in the shop; labels come from `dict.sort`. */
export const SORT_OPTIONS: ProductSort[] = ["featured", "price-asc", "price-desc", "newest"];

export function parseSort(value: string | undefined): ProductSort {
  return SORT_OPTIONS.includes(value as ProductSort) ? (value as ProductSort) : "featured";
}
