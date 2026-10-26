"use client";

import { TruckIcon } from "@/components/ui/icons";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import type { Cart } from "@/lib/commerce/types";
import { offerMoney, offers } from "@/lib/content/offers";
import { formatMoney } from "@/lib/format";
import styles from "./Cart.module.css";

/** How far the cart is from free shipping, and a nudge towards the bundle discount. */
export function CartPerks({ cart }: { cart: Cart }) {
  const { lang, dict } = useI18n();
  const t = dict.cart;
  const { shipping, bundle } = offers;
  const destination = shipping.destination[lang];

  // Shopify's free-shipping rate looks at the total after discounts.
  const total = Number(cart.cost.totalAmount.amount);
  const left = Math.max(0, shipping.freeFrom - total);
  const progress = Math.min(100, Math.round((total / shipping.freeFrom) * 100));

  return (
    <div className={styles.perks}>
      <p className={styles.perkText}>
        <TruckIcon />
        {left > 0
          ? fmt(t.freeShippingLeft, { amount: formatMoney(offerMoney(left), lang), destination })
          : fmt(t.freeShippingDone, { destination })}
      </p>
      <div
        className={styles.meter}
        role="progressbar"
        aria-label={t.freeShippingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} data-done={left === 0} />
      </div>
      {cart.totalQuantity === bundle.minItems - 1 ? (
        <p className={styles.perkHint}>{fmt(t.bundleHint, { percent: bundle.percent })}</p>
      ) : null}
    </div>
  );
}
