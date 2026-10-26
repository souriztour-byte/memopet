import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * The pet product quiz: three answers → product and size suggestions. The
 * sizes and measurements are the supplier's (see src/lib/demo/catalog.ts);
 * update them here if a product's sizes change in Shopify.
 */
export type Pet = "cat" | "dog";
export type Need = "paws" | "bed" | "both";
export type Weight = "small" | "medium" | "large";

type Reason = keyof Pick<
  Dictionary["quiz"],
  "pawsSmall" | "pawsLarge" | "sofaFit" | "sofaOver" | "bagFit"
>;
export type Suggestion = { handle: string; size: string; reason: Reason; vars: Record<string, string | number> };

const PAW_WASHERS = [
  { handle: "silicone-paw-washer", small: { size: "S", cm: 9 }, large: { size: "M", cm: 11 } },
  { handle: "paw-washer-cup", small: { size: "S", cm: 9 }, large: { size: "L", cm: 10 } },
];
const SOFA = { handle: "luxury-cat-sofa-bed", small: { size: "M", kg: 4 }, large: { size: "L", kg: 9 } };
const BAG = {
  handle: "warming-sleeping-bag-bed",
  small: { size: "S", dims: "42 × 42 × 30" },
  large: { size: "M", dims: "52 × 52 × 32" },
};

export function suggest(pet: Pet, need: Need, weight: Weight): { picks: Suggestion[]; noBed: boolean } {
  const picks: Suggestion[] = [];
  let noBed = false;

  if (need !== "bed") {
    for (const w of PAW_WASHERS) {
      const fit = weight === "small" ? w.small : w.large;
      picks.push({ handle: w.handle, size: fit.size, reason: weight === "small" ? "pawsSmall" : "pawsLarge", vars: fit });
    }
  }
  if (need !== "paws") {
    const bag = weight === "small" ? BAG.small : BAG.large;
    if (pet === "cat") {
      const sofa = weight === "small" ? SOFA.small : SOFA.large;
      picks.push({ handle: SOFA.handle, size: sofa.size, reason: weight === "large" ? "sofaOver" : "sofaFit", vars: sofa });
      picks.push({ handle: BAG.handle, size: bag.size, reason: "bagFit", vars: bag });
    } else if (weight === "large") {
      // Both beds are made for cats and small dogs.
      noBed = true;
    } else {
      picks.push({ handle: BAG.handle, size: bag.size, reason: "bagFit", vars: bag });
    }
  }
  return { picks, noBed };
}
