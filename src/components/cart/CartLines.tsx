"use client";

import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { MAX_QTY } from "@/lib/limits";
import type { CartLine } from "@/lib/commerce/types";
import { formatMoney, optionsLabel } from "@/lib/format";
import { useCart } from "./CartProvider";
import styles from "./Cart.module.css";

export function CartLines({ lines, onNavigate }: { lines: CartLine[]; onNavigate?: () => void }) {
  const { updateItem, pendingLineId } = useCart();
  const { lang, dict } = useI18n();
  const t = dict.cart;
  return (
    <ul className={styles.lines}>
      {lines.map((line) => {
        const { merchandise } = line;
        const busy = pendingLineId === line.id;
        const options = optionsLabel(merchandise.selectedOptions);
        const href = localizePath(lang, `/products/${merchandise.product.handle}`);
        const title = merchandise.product.title;
        return (
          <li key={line.id} className={styles.line} aria-busy={busy}>
            <Link
              href={href}
              className={`${styles.thumb} ${merchandise.product.tile}`}
              onClick={onNavigate}
              tabIndex={-1}
              aria-hidden="true"
            >
              <ProductMedia
                image={merchandise.image}
                illustration={merchandise.product.illustration}
                alt=""
                sizes="64px"
              />
            </Link>
            <div className={styles.info}>
              <Link href={href} className={styles.name} onClick={onNavigate}>
                {title}
              </Link>
              {options ? <span className={styles.meta}>{options}</span> : null}
              <span className={styles.meta}>
                {fmt(t.each, { price: formatMoney(line.cost.amountPerQuantity, lang) })}
              </span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => updateItem(line.id, 0)}
                disabled={busy}
              >
                {t.remove}
              </button>
            </div>
            <div className={styles.right}>
              <span className="qty">
                <button
                  type="button"
                  aria-label={fmt(t.removeOne, { title })}
                  onClick={() => updateItem(line.id, line.quantity - 1)}
                  disabled={busy}
                >
                  −
                </button>
                <output aria-label={t.quantity}>{line.quantity}</output>
                <button
                  type="button"
                  aria-label={fmt(t.addOne, { title })}
                  onClick={() => updateItem(line.id, line.quantity + 1)}
                  disabled={busy || line.quantity >= MAX_QTY}
                >
                  +
                </button>
              </span>
              <span className={styles.lineTotal}>{formatMoney(line.cost.totalAmount, lang)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
