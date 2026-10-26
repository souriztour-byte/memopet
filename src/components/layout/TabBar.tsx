"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { BagIcon, GridIcon, HomeIcon, SearchIcon } from "@/components/ui/icons";
import { localizePath } from "@/i18n/config";
import { plural } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./TabBar.module.css";

/** Phone-only bar at the bottom of the screen: Home, Shop, Search and Cart. */
export function TabBar() {
  const { lang, dict } = useI18n();
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const t = dict.header;
  const count = cart?.totalQuantity ?? 0;
  const home = localizePath(lang, "/");
  const shop = localizePath(lang, "/shop");

  return (
    <nav className={styles.bar} aria-label={t.tabBar}>
      <Link href={home} className={styles.tab} aria-current={pathname === home ? "page" : undefined}>
        <HomeIcon />
        {t.tabHome}
      </Link>
      <Link href={shop} className={styles.tab} aria-current={pathname === shop ? "page" : undefined}>
        <GridIcon />
        {t.tabShop}
      </Link>
      <Link href={`${shop}#shop-search`} className={styles.tab}>
        <SearchIcon />
        {t.tabSearch}
      </Link>
      <button
        type="button"
        className={styles.tab}
        data-cart-target
        onClick={openCart}
        aria-label={count ? plural(lang, count, dict.cart.openWithCount) : dict.cart.open}
      >
        <span className={styles.bag}>
          <BagIcon />
          {count ? (
            <span key={count} className={styles.count} aria-hidden="true">
              {count}
            </span>
          ) : null}
        </span>
        {t.tabCart}
      </button>
    </nav>
  );
}
