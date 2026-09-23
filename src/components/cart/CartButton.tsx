"use client";

import { BagIcon } from "@/components/ui/icons";
import { useCart } from "./CartProvider";
import styles from "./Cart.module.css";

export function CartButton() {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button
      type="button"
      className={`btn btn-pink btn-sm ${styles.cartBtn}`}
      onClick={openCart}
      aria-label={count ? `Open cart, ${count} item${count === 1 ? "" : "s"}` : "Open cart"}
    >
      <BagIcon />
      Cart
      {count ? (
        <span className={styles.badge} aria-hidden="true">
          {count}
        </span>
      ) : null}
    </button>
  );
}
