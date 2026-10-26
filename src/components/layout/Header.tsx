import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
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
          {/* Grid: logo centred with the cart on the right; the menu runs
              underneath on computers and drops down from the Menu button on phones. */}
          <MainNav />
          <Link
            href={localizePath(lang, "/")}
            aria-label={fmt(dict.header.homeLink, { name: siteConfig.name })}
            className={styles.logoLink}
          >
            <Wordmark className={styles.logo} />
          </Link>
          <div className={styles.actions}>
            <LanguageSwitcher className={styles.langBar} />
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
