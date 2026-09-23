import type { Money } from "@/lib/commerce/types";

/** "$15", "$15.50", "€6.55" — whole amounts drop the decimals, like the prototype. */
export function formatMoney({ amount, currencyCode }: Money) {
  const value = Number(amount);
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function optionsLabel(options: { name: string; value: string }[]) {
  return options.map((o) => `${o.name}: ${o.value}`).join(" · ");
}
