"use client";

import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import type { Money } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";

type Props = {
  min: Money;
  max?: Money;
  compareAt?: Money | null;
  className?: string;
};

/** Shows "From $X" when variants are priced differently. */
export function Price({ min, max, compareAt, className }: Props) {
  const { lang, dict } = useI18n();
  const varies = max && Number(max.amount) > Number(min.amount);
  const onSale = compareAt && Number(compareAt.amount) > Number(min.amount);
  return (
    <span className={className}>
      {varies ? `${dict.product.from} ` : null}
      {formatMoney(min, lang)}
      {onSale ? (
        <>
          {" "}
          <s
            aria-label={fmt(dict.product.was, { price: formatMoney(compareAt, lang) })}
            style={{ color: "var(--muted)", fontWeight: 500 }}
          >
            {formatMoney(compareAt, lang)}
          </s>
        </>
      ) : null}
    </span>
  );
}
