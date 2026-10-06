import { intlLocale, type Locale } from "./config";

/** Fills `{name}` placeholders: fmt("{count} items", { count: 2 }) → "2 items". */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export type PluralForms = { one: string; other: string };

/** Picks the singular or plural template for `count` and fills `{count}`. */
export function plural(lang: Locale, count: number, forms: PluralForms): string {
  const form = new Intl.PluralRules(intlLocale[lang]).select(count) === "one" ? forms.one : forms.other;
  return fmt(form, { count });
}

/** ISO date ("2026-09-23") → "23 September 2026" / "23 de septiembre de 2026". */
export function formatDate(lang: Locale, isoDate: string): string {
  return new Intl.DateTimeFormat(intlLocale[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
