"use client";

import Link from "next/link";
import type { Cart } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import styles from "./Cart.module.css";

export function CartSummary({
  cart,
  demoMode,
  showViewCart,
  onNavigate,
}: {
  cart: Cart;
  demoMode: boolean;
  showViewCart?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className={styles.checkout}>
      <div className={styles.total}>
        <span>Subtotal</span>
        <span>{formatMoney(cart.cost.subtotalAmount)}</span>
      </div>
      <p className="small">Shipping and any taxes are calculated at checkout.</p>
      {cart.checkoutUrl ? (
        <a className="btn btn-purple btn-block" href={cart.checkoutUrl}>
          Checkout
        </a>
      ) : (
        <button type="button" className="btn btn-purple btn-block" disabled>
          Checkout
        </button>
      )}
      {demoMode ? (
        <p className="small">
          Demo mode: checkout turns on once the store is connected to Shopify.
        </p>
      ) : null}
      {showViewCart ? (
        <Link href="/cart" className="btn btn-ghost btn-block" onClick={onNavigate}>
          View cart
        </Link>
      ) : null}
    </div>
  );
}
