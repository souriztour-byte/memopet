"use client";

import { useEffect, useState } from "react";
import { intlLocale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";

type Props = {
  /** Days to prepare the order, then days in transit (supplier estimates). */
  processing: { minDays: number; maxDays: number };
  delivery: { minDays: number; maxDays: number };
  destination: string;
  className?: string;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * "Order today, arrives between Thu 6 Nov and Mon 17 Nov." Worked out in the
 * visitor's browser, so cached pages still show today's dates.
 */
export function DeliveryEstimate({ processing, delivery, destination, className }: Props) {
  const { lang, dict } = useI18n();
  const [today, setToday] = useState<Date | null>(null);
  // Dates depend on the visitor's clock, so they're filled in after the page loads.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setToday(new Date()), []);
  if (!today) return <span className={className}>&nbsp;</span>;

  const format = new Intl.DateTimeFormat(intlLocale[lang], { weekday: "short", day: "numeric", month: "short" });
  const from = format.format(addDays(today, processing.minDays + delivery.minDays));
  const to = format.format(addDays(today, processing.maxDays + delivery.maxDays));
  return <span className={className}>{fmt(dict.shipping.arrives, { from, to, destination })}</span>;
}
