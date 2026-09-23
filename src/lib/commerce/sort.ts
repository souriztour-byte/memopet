import type { ProductSort } from "./types";

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export function parseSort(value: string | undefined): ProductSort {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as ProductSort) : "featured";
}
