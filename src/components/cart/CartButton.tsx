"use client";

import { BagIcon } from "@/components/ui/icons";
import { plural } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "./CartProvider";
import styles from "./Cart.module.css";

export function CartButton() {
  const { cart, openCart } = useCart();
  const { lang, dict } = useI18n();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button
      type="button"
      className={`btn btn-pink btn-sm ${styles.cartBtn}`}
      onClick={openCart}
      aria-label={count ? plural(lang, count, dict.cart.openWithCount) : dict.cart.open}
    >
      <BagIcon />
      {dict.cart.button}
      {count ? (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  );
}
