"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { localeNames, locales, switchLocalePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./LanguageSwitcher.module.css";

/** "EN | ES" — links to the same page in the other language, keeping any search. */
export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <Suspense fallback={<Switcher className={className} search="" />}>
      <SwitcherWithSearch className={className} />
    </Suspense>
  );
}

function SwitcherWithSearch({ className }: { className?: string }) {
  const search = useSearchParams().toString();
  return <Switcher className={className} search={search ? `?${search}` : ""} />;
}

function Switcher({ className, search }: { className?: string; search: string }) {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  return (
    <div role="group" aria-label={dict.language.label} className={`${styles.switcher} ${className ?? ""}`}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`${switchLocalePath(pathname, l)}${search}`}
          hrefLang={l}
          lang={l}
          className={styles.option}
          aria-current={l === lang ? "true" : undefined}
          aria-label={l === lang ? localeNames[l] : fmt(dict.language.switchTo, { language: localeNames[l] })}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
