"use client";

import Link from "next/link";
import { ProductMedia } from "@/components/product/ProductMedia";
import { MAX_QTY } from "@/lib/limits";
import type { CartLine } from "@/lib/commerce/types";
import { formatMoney, optionsLabel } from "@/lib/format";
import { useCart } from "./CartProvider";
import styles from "./Cart.module.css";

export function CartLines({ lines, onNavigate }: { lines: CartLine[]; onNavigate?: () => void }) {
  const { updateItem, pendingLineId } = useCart();
  return (
    <ul className={styles.lines}>
      {lines.map((line) => {
        const { merchandise } = line;
        const busy = pendingLineId === line.id;
        const options = optionsLabel(merchandise.selectedOptions);
        return (
          <li key={line.id} className={styles.line} aria-busy={busy}>
            <Link
              href={`/products/${merchandise.product.handle}`}
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
              <Link
                href={`/products/${merchandise.product.handle}`}
                className={styles.name}
                onClick={onNavigate}
              >
                {merchandise.product.title}
              </Link>
              {options ? <span className={styles.meta}>{options}</span> : null}
              <span className={styles.meta}>{formatMoney(line.cost.amountPerQuantity)} each</span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => updateItem(line.id, 0)}
                disabled={busy}
              >
                Remove
              </button>
            </div>
            <div className={styles.right}>
              <span className="qty">
                <button
                  type="button"
                  aria-label={`Remove one ${merchandise.product.title}`}
                  onClick={() => updateItem(line.id, line.quantity - 1)}
                  disabled={busy}
                >
                  −
                </button>
                <output aria-label="Quantity">{line.quantity}</output>
                <button
                  type="button"
                  aria-label={`Add one ${merchandise.product.title}`}
                  onClick={() => updateItem(line.id, line.quantity + 1)}
                  disabled={busy || line.quantity >= MAX_QTY}
                >
                  +
                </button>
              </span>
              <span className={styles.lineTotal}>{formatMoney(line.cost.totalAmount)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
