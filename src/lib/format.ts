import type { Money } from "@/lib/commerce/types";
import type { Locale } from "@/i18n/config";

/** Euro prices read "€15" / "€6.55" in English and "15 €" / "6,55 €" in Spanish. */
const MONEY_LOCALE: Record<Locale, string> = { en: "en", es: "es-ES" };

/** "€15", "€15.50" — whole amounts drop the decimals, like the prototype. */
export function formatMoney({ amount, currencyCode }: Money, lang: Locale) {
  const value = Number(amount);
  return new Intl.NumberFormat(MONEY_LOCALE[lang], {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function optionsLabel(options: { name: string; value: string }[]) {
  return options.map((o) => `${o.name}: ${o.value}`).join(" · ");
}
