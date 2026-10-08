"use client";

import { useState } from "react";
import { BagIcon } from "@/components/ui/icons";
import { plural } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "./CartProvider";
import styles from "./Cart.module.css";

export function CartButton() {
  const { cart, openCart } = useCart();
  const { lang, dict } = useI18n();
  const count = cart?.totalQuantity ?? 0;

  // Bounce the bag when something is added (not when the saved cart first loads).
  const ready = cart != null;
  const [seen, setSeen] = useState({ count, ready });
  const [bumps, setBumps] = useState(0);
  if (seen.count !== count || seen.ready !== ready) {
    if (seen.ready && ready && count > seen.count) setBumps(bumps + 1);
    setSeen({ count, ready });
  }

  return (
    <button
      type="button"
      className={`btn btn-pink btn-sm ${styles.cartBtn}`}
      onClick={openCart}
      aria-label={count ? plural(lang, count, dict.cart.openWithCount) : dict.cart.open}
    >
      <span key={bumps} className={bumps ? `${styles.bag} ${styles.bump}` : styles.bag}>
        <BagIcon />
      </span>
      {dict.cart.button}
      {count ? (
        <span key={`badge-${bumps}`} className={styles.badge} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  );
}
