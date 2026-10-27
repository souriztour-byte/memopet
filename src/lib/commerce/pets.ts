import type { ProductSummary } from "./types";

export type Pet = "all" | "dogs" | "cats";

// Matches the "for" line from Shopify (tag pet:…), in English and Spanish.
const PET_WORDS: Record<Exclude<Pet, "all">, RegExp> = {
  dogs: /\b(dogs?|perros?)\b/i,
  cats: /\b(cats?|gatos?)\b/i,
};

/** Whether a product is for the pet. A product without a "for" line counts for both. */
export const isFor = (p: ProductSummary, pet: Pet) => pet === "all" || !p.petType || PET_WORDS[pet].test(p.petType);

/** The pet choices worth offering: All, plus each pet that has products of its own. */
export const petsFor = (products: ProductSummary[]) =>
  (["all", "dogs", "cats"] as const).filter((p) => p === "all" || products.some((x) => isFor(x, p)));
