import type { Locale } from "@/i18n/config";
import type { Money } from "@/lib/commerce/types";

/**
 * Shop offers shown on the site. They only describe what is set up in Shopify
 * admin, so change both together:
 *   • Settings → Shipping and delivery → General profile → zone "Spain":
 *     "Standard shipping" €3.90 up to €39.99, "Free shipping" from €40.
 *   • Discounts → "Buy 2, save 10%": automatic, 2+ items, combines with
 *     shipping discounts only. `bundle.shopifyTitle` must match its title.
 *   • Discounts → code WELCOME10: 10% off, once per customer. Shown after the
 *     email sign-up (see `subscribeAction`).
 */
export const offers = {
  currencyCode: "EUR",
  shipping: {
    destination: { en: "Spain", es: "España" },
    standardRate: 3.9,
    /** Order total, after discounts, from which shipping is free. */
    freeFrom: 40,
  },
  bundle: { minItems: 2, percent: 10, shopifyTitle: "Buy 2, save 10%" },
  welcome: { code: "WELCOME10", percent: 10 },
} as const satisfies {
  currencyCode: string;
  shipping: { destination: Record<Locale, string>; standardRate: number; freeFrom: number };
  bundle: { minItems: number; percent: number; shopifyTitle: string };
  welcome: { code: string; percent: number };
};

export const offerMoney = (amount: number): Money => ({
  amount: amount.toFixed(2),
  currencyCode: offers.currencyCode,
});
