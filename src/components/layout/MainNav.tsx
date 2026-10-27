"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { navLinks } from "@/lib/config";
import { ArrowIcon, MenuIcon } from "@/components/ui/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Header.module.css";

type Category = { href: string; title: string; photo: { src: string; alt: string } | null };

/**
 * The menu. On computers it's a row under the logo, and Categories opens a
 * panel with each category's round photo. On phones it slides in from the
 * left, its links arriving one after another.
 */
export function MainNav({ categories }: { categories: Category[] }) {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.menuToggle}
        aria-expanded={open}
        aria-controls="main-menu"
        aria-label={dict.header.menu}
        onClick={() => setOpen((v) => !v)}
      >
        <MenuIcon />
        <span>{dict.header.menu}</span>
      </button>
      {open ? <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" /> : null}
      <nav aria-label={dict.header.mainNav} className={styles.nav}>
        <ul
          id="main-menu"
          className={open ? styles.isOpen : undefined}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <li className={styles.menuHead}>
            <button type="button" className="x" onClick={() => setOpen(false)} aria-label={dict.header.menuClose}>
              ×
            </button>
          </li>
          {navLinks.map((link, i) => {
            const href = localizePath(lang, link.href);
            const drop = link.key === "collections" && categories.length > 0;
            return (
              <li key={link.href} className={drop ? styles.hasDrop : undefined} style={{ "--i": i } as React.CSSProperties}>
                <Link href={href} aria-current={isActive(href) ? "page" : undefined}>
                  {dict.nav[link.key]}
                </Link>
                {drop ? (
                  <div className={styles.drop}>
                    <ul className={styles.dropList}>
                      {categories.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className={styles.dropItem}>
                            <span className={styles.dropPic}>
                              {c.photo ? <Image src={c.photo.src} alt="" fill sizes="120px" /> : null}
                            </span>
                            <span className={styles.dropTitle}>
                              {c.title}
                              <ArrowIcon />
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={localizePath(lang, "/shop")} className={styles.dropItem}>
                          <span className={`${styles.dropPic} ${styles.dropAll}`} aria-hidden="true">
                            ✦
                          </span>
                          <span className={styles.dropTitle}>
                            {dict.header.categoriesAll}
                            <ArrowIcon />
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : null}
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
