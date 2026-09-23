import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CartButton } from "@/components/cart/CartButton";
import { siteConfig } from "@/lib/config";
import { MainNav } from "./MainNav";
import styles from "./Header.module.css";

export function Header() {
  return (
    <>
      <div className={styles.announcement}>
        {siteConfig.announcement} ·{" "}
        <Link href={`/products/${siteConfig.featuredProductHandle}`} className={styles.announcementLink}>
          Shop now
        </Link>
      </div>
      <header className={styles.top}>
        <div className={`wrap ${styles.bar}`}>
          <Link href="/" aria-label={`${siteConfig.name} home`} className={styles.logoLink}>
            <Logo className={styles.logo} />
          </Link>
          <MainNav />
          <CartButton />
        </div>
      </header>
    </>
  );
}
