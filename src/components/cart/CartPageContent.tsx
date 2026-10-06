"use client";

import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { rich } from "@/i18n/rich";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { CartSummary } from "./CartSummary";
import styles from "./CartPage.module.css";

export function CartPageContent() {
  const { cart, ready, demoMode } = useCart();
  const { lang, dict } = useI18n();
  const t = dict.cart;

  if (!ready) return <p className="muted">{t.loading}</p>;

  if (!cart || !cart.lines.length) {
    return (
      <div className={styles.empty}>
        <p className="lead">{t.empty}</p>
        <Link href={localizePath(lang, "/shop")} className="btn btn-pink">
          {dict.common.startShopping}
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
          {rich(t.policiesNote, {
            shipping: (
              <Link href={localizePath(lang, "/policies/shipping-policy")}>{t.policiesShipping}</Link>
            ),
            refund: <Link href={localizePath(lang, "/policies/refund-policy")}>{t.policiesRefund}</Link>,
          })}
        </p>
      </div>
    </div>
  );
}
