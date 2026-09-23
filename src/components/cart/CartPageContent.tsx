"use client";

import Link from "next/link";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { CartSummary } from "./CartSummary";
import styles from "./CartPage.module.css";

export function CartPageContent() {
  const { cart, ready, demoMode } = useCart();

  if (!ready) return <p className="muted">Loading your cart…</p>;

  if (!cart || !cart.lines.length) {
    return (
      <div className={styles.empty}>
        <p className="lead">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-pink">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.lines}>
        <CartLines lines={cart.lines} />
      </div>
      <div className={styles.summary}>
        <CartSummary cart={cart} demoMode={demoMode} />
        <p className="small" style={{ padding: "12px 4px 0" }}>
          See our <Link href="/policies/shipping-policy">shipping</Link> and{" "}
          <Link href="/policies/refund-policy">refund</Link> policies.
        </p>
      </div>
    </div>
  );
}
