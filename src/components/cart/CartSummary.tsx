"use client";

import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
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
  const { lang, dict } = useI18n();
  const t = dict.cart;
  return (
    <div className={styles.checkout}>
      <div className={styles.total}>
        <span>{t.subtotal}</span>
        <span>{formatMoney(cart.cost.subtotalAmount, lang)}</span>
      </div>
      <p className="small">{t.taxesNote}</p>
      {cart.checkoutUrl ? (
        <a className="btn btn-purple btn-block" href={cart.checkoutUrl}>
          {t.checkout}
        </a>
      ) : (
        <button type="button" className="btn btn-purple btn-block" disabled>
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
