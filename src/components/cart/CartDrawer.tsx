"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { CartLines } from "./CartLines";
import { CartPerks } from "./CartPerks";
import { CartSuggestions } from "./CartSuggestions";
import { useCart } from "./CartProvider";
import { CartSummary } from "./CartSummary";
import styles from "./Cart.module.css";

export function CartDrawer() {
  const { cart, ready, demoMode, isOpen, closeCart } = useCart();
  const { dict } = useI18n();
  const t = dict.cart;
  const ref = useRef<HTMLDialogElement>(null);

  // Keep the native <dialog> (focus trap, Esc, inert page) in sync with state.
  // Closing slides the drawer out first (at once with reduced motion).
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isOpen) delete dialog.dataset.closing;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) dialog.close();
      else {
        dialog.dataset.closing = "";
        timer = setTimeout(() => {
          dialog.close();
          delete dialog.dataset.closing;
        }, 280);
      }
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => clearTimeout(timer);
  }, [isOpen]);

  const lines = cart?.lines ?? [];

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-label={t.title}
      onClose={closeCart}
      onCancel={(e) => {
        e.preventDefault();
        closeCart();
      }}
      onClick={(e) => {
        if (e.target === ref.current) closeCart();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2>{t.title}</h2>
          <button type="button" className="x" onClick={closeCart} aria-label={t.close}>
            ×
          </button>
        </header>
        <div className={styles.items}>
          {!ready ? (
            <p className={styles.empty}>{t.loading}</p>
          ) : lines.length ? (
            <>
              <CartLines lines={lines} onNavigate={closeCart} />
              {cart ? <CartSuggestions cart={cart} onNavigate={closeCart} /> : null}
            </>
          ) : (
            <p className={styles.empty}>
              {t.empty}
              <br />
              {t.emptyHint}
            </p>
          )}
        </div>
        {cart && lines.length ? (
          <>
            <CartPerks cart={cart} />
            <CartSummary cart={cart} demoMode={demoMode} showViewCart onNavigate={closeCart} />
          </>
        ) : null}
      </div>
    </dialog>
  );
}
