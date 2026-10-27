import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { CartButton } from "@/components/cart/CartButton";
import { SearchButton } from "@/components/search/SearchButton";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { getCollections } from "@/lib/commerce";
import { collectionPresentation } from "@/lib/commerce/presentation";
import { siteConfig } from "@/lib/config";
import { offerMoney, offers } from "@/lib/content/offers";
import { formatMoney } from "@/lib/format";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainNav } from "./MainNav";
import styles from "./Header.module.css";

export async function Header() {
  const { lang, dict } = await getI18n();
  // The Categories dropdown: each category with its round photo.
  const categories = (await getCollections(lang)).map((c) => {
    const photo = collectionPresentation(c.handle, c.title).photo;
    return {
      href: localizePath(lang, `/collections/${c.handle}`),
      title: c.title,
      photo: c.image
        ? { src: c.image.url, alt: c.image.altText || c.title }
        : photo
          ? { src: photo.src, alt: dict.photos[photo.alt] }
          : null,
    };
  });
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
          <MainNav categories={categories} />
          <Link
            href={localizePath(lang, "/")}
            aria-label={fmt(dict.header.homeLink, { name: siteConfig.name })}
            className={styles.logoLink}
          >
            <Wordmark className={styles.logo} />
          </Link>
          <div className={styles.actions}>
            <SearchButton className={styles.searchButton} />
            <LanguageSwitcher className={styles.langBar} />
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
