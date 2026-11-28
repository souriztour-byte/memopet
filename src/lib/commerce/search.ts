import type { ProductSummary } from "./types";

export const MAX_PRODUCT_SEARCH_LENGTH = 100;

const normalise = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

export function productSearchTerms(query: string) {
  return normalise(query).trim().split(/\s+/).filter(Boolean);
}

export function matchesProductSearch(
  product: Pick<ProductSummary, "title" | "petType">,
  terms: string[],
) {
  if (terms.length === 0) return true;
  const text = normalise(`${product.title} ${product.petType ?? ""}`);
  return terms.every((term) => text.includes(term));
}
