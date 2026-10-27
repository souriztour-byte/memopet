"use client";

import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/format";
import type { Cart, CartDiscount } from "@/lib/commerce/types";
import { offers } from "@/lib/content/offers";
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
  const { lang, dict } = useI18n();
  const t = dict.cart;
  // Shopify discount titles aren't translated; the bundle has its own text.
  const label = (d: CartDiscount) =>
    d.kind === "code"
      ? fmt(t.codeDiscount, { code: d.code })
      : d.title === offers.bundle.shopifyTitle
        ? fmt(t.bundleDiscount, { percent: offers.bundle.percent })
        : d.title;
  const discounts = cart.discounts.filter((d) => Number(d.amount.amount) > 0);
  return (
    <div className={styles.checkout}>
      {discounts.length ? (
        <>
          <div className={styles.subtotal}>
            <span>{t.subtotal}</span>
            <span>{formatMoney(cart.cost.subtotalAmount, lang)}</span>
          </div>
          {discounts.map((d, i) => (
            <div key={i} className={styles.discount}>
              <span>{label(d)}</span>
              <span>−{formatMoney(d.amount, lang)}</span>
            </div>
          ))}
          <div className={styles.total}>
            <span>{t.total}</span>
            <span>{formatMoney(cart.cost.totalAmount, lang)}</span>
          </div>
        </>
      ) : (
        <div className={styles.total}>
          <span>{t.subtotal}</span>
          <span>{formatMoney(cart.cost.subtotalAmount, lang)}</span>
        </div>
      )}
      <p className="small">{t.taxesNote}</p>
      {cart.checkoutUrl ? (
        <a className="btn btn-gold btn-block" href={cart.checkoutUrl}>
          {t.checkout}
        </a>
      ) : (
        <button type="button" className="btn btn-gold btn-block" disabled>
          {t.checkout}
        </button>
      )}
      {demoMode ? <p className="small">{t.demoNote}</p> : null}
      {showViewCart ? (
        <Link href={localizePath(lang, "/cart")} className="btn btn-ghost btn-block" onClick={onNavigate}>
          {t.viewCart}
        </Link>
      ) : null}
    </div>
  );
}
