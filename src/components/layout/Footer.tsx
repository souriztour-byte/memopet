import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { getLocalPolicies } from "@/content/policies";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { siteConfig } from "@/lib/config";
import styles from "./Footer.module.css";

export async function Footer() {
  const { lang, dict } = await getI18n();
  const t = dict.footer;
  const shopLinks = [
    { href: "/shop", label: t.shopAll },
    { href: "/collections", label: t.categories },
    { href: "/cart", label: t.cart },
  ];
  const helpLinks = [
    { href: "/how-to-order", label: t.howToOrder },
    { href: "/faq", label: t.faq },
    { href: "/contact", label: t.contact },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo className={styles.logo} />
          <p>{dict.brand.tagline}</p>
        </div>
        <nav aria-label={t.shop} className={styles.col}>
          <h2>{t.shop}</h2>
          <ul>
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={localizePath(lang, l.href)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.help} className={styles.col}>
          <h2>{t.help}</h2>
          <ul>
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={localizePath(lang, l.href)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t.policies} className={styles.col}>
          <h2>{t.policies}</h2>
          <ul>
            {getLocalPolicies(lang).map((p) => (
              <li key={p.handle}>
                <Link href={localizePath(lang, `/policies/${p.handle}`)}>{p.navLabel}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap">
        <div className={styles.bottom}>
          <span>{fmt(t.copyright, { year, name: siteConfig.name })}</span>
        </div>
      </div>
    </footer>
  );
}
