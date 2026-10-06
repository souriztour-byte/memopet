import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { fmt } from "@/i18n/format";

/**
 * Fulfilment facts shown on product pages, the FAQ and the Shipping Policy.
 *
 * Source: the supplier listing for the paw washer (CJ Dropshipping), with the
 * "Ship to: ES" / "CJPacket Ordinary" shipping method selected:
 *   • Shipping from: China
 *   • Estimated processing time: 1–3 days for 90% of orders
 *   • Estimated delivery time: 8–18 days
 *
 * These are the supplier's estimates for Spain only. If you sell to other
 * countries, add their estimates to `deliveryEstimates` once confirmed.
 * Customer-facing shipping rates are set in Shopify and shown at checkout.
 */
export const shippingFacts = {
  shipsFrom: { en: "China", es: "China" },
  processing: { minDays: 1, maxDays: 3, sharePercent: 90 },
  deliveryEstimates: [
    { destination: { en: "Spain", es: "España" }, minDays: 8, maxDays: 18, method: "standard" },
  ],
} as const satisfies {
  shipsFrom: Record<Locale, string>;
  processing: { minDays: number; maxDays: number; sharePercent: number };
  deliveryEstimates: readonly {
    destination: Record<Locale, string>;
    minDays: number;
    maxDays: number;
    method: keyof Dictionary["shipping"]["methods"];
  }[];
};

/** The facts above as display text: "1–3 days", "around 90% of orders", … */
export function getShipping(lang: Locale, dict: Dictionary) {
  const days = (min: number, max: number) => fmt(dict.shipping.dayRange, { min, max });
  const { processing } = shippingFacts;
  const deliveryEstimates = shippingFacts.deliveryEstimates.map((e) => ({
    destination: e.destination[lang],
    days: days(e.minDays, e.maxDays),
    method: dict.shipping.methods[e.method],
  }));
  return {
    shipsFrom: shippingFacts.shipsFrom[lang],
    processing: {
      days: days(processing.minDays, processing.maxDays),
      share: fmt(dict.shipping.share, { percent: processing.sharePercent }),
    },
    deliveryEstimates,
    primaryEstimate: deliveryEstimates[0],
  };
}

export type ShippingCopy = ReturnType<typeof getShipping>;
