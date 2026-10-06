"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { navLinks } from "@/lib/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Header.module.css";

export function MainNav() {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        type="button"
        className={`btn btn-ghost ${styles.menuToggle}`}
        aria-expanded={open}
        aria-controls="main-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {dict.header.menu}
      </button>
      <nav aria-label={dict.header.mainNav} className={styles.nav}>
        <ul
          id="main-menu"
          className={open ? styles.isOpen : undefined}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {navLinks.map((link) => {
            const href = localizePath(lang, link.href);
            return (
              <li key={link.href}>
                <Link href={href} aria-current={isActive(href) ? "page" : undefined}>
                  {dict.nav[link.key]}
                </Link>
              </li>
            );
          })}
          {/* On small screens the language switch lives in the menu. */}
          <li className={styles.langMenu}>
            <LanguageSwitcher />
          </li>
        </ul>
      </nav>
    </>
  );
}
