import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CartButton } from "@/components/cart/CartButton";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { siteConfig } from "@/lib/config";
import { offerMoney, offers } from "@/lib/content/offers";
import { formatMoney } from "@/lib/format";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainNav } from "./MainNav";
import styles from "./Header.module.css";

export async function Header() {
  const { lang, dict } = await getI18n();
  return (
    <>
      <div className={styles.announcement}>
        {fmt(dict.header.announcement, {
          destination: offers.shipping.destination[lang],
          amount: formatMoney(offerMoney(offers.shipping.freeFrom), lang),
          percent: offers.bundle.percent,
        })}
        <span className={styles.announcementMore}>
          {" "}
          ·{" "}
          <Link
            href={localizePath(lang, `/products/${siteConfig.featuredProductHandle}`)}
            className={styles.announcementLink}
          >
            {dict.header.shopNow}
          </Link>
        </span>
      </div>
      <header className={styles.top}>
        <div className={`wrap ${styles.bar}`}>
          <Link
            href={localizePath(lang, "/")}
            aria-label={fmt(dict.header.homeLink, { name: siteConfig.name })}
            className={styles.logoLink}
          >
            <Logo className={styles.logo} />
          </Link>
          <MainNav />
          <div className={styles.actions}>
            <LanguageSwitcher className={styles.langBar} />
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
