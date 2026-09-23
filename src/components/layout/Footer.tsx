import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { localPolicies } from "@/content/policies";
import { siteConfig } from "@/lib/config";
import styles from "./Footer.module.css";

const shopLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/collections", label: "Categories" },
  { href: "/cart", label: "Your cart" },
];

const helpLinks = [
  { href: "/how-to-order", label: "How to order" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo className={styles.logo} />
          <p>{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Shop" className={styles.col}>
          <h2>Shop</h2>
          <ul>
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Help" className={styles.col}>
          <h2>Help</h2>
          <ul>
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Policies" className={styles.col}>
          <h2>Policies</h2>
          <ul>
            {localPolicies.map((p) => (
              <li key={p.handle}>
                <Link href={`/policies/${p.handle}`}>{p.navLabel}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="wrap">
        <div className={styles.bottom}>
          <span>
            © {year} {siteConfig.name} · Online pet shop
          </span>
        </div>
      </div>
    </footer>
  );
}
