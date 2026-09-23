"use client";

import { useEffect, useRef } from "react";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { CartSummary } from "./CartSummary";
import styles from "./Cart.module.css";

export function CartDrawer() {
  const { cart, ready, demoMode, isOpen, closeCart } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  // Keep the native <dialog> (focus trap, Esc, inert page) in sync with state.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const lines = cart?.lines ?? [];

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-label="Your cart"
      onClose={closeCart}
      onClick={(e) => {
        if (e.target === ref.current) closeCart();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2>Your cart</h2>
          <button type="button" className="x" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </header>
        <div className={styles.items}>
          {!ready ? (
            <p className={styles.empty}>Loading your cart…</p>
          ) : lines.length ? (
            <CartLines lines={lines} onNavigate={closeCart} />
          ) : (
            <p className={styles.empty}>
              Your cart is empty.
              <br />
              Tap + on a product to add it.
            </p>
          )}
        </div>
        {cart && lines.length ? <CartSummary cart={cart} demoMode={demoMode} showViewCart onNavigate={closeCart} /> : null}
      </div>
    </dialog>
  );
}
