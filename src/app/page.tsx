import Link from "next/link";
import { HeroIllustration } from "@/components/art/Illustration";
import { CategoryGrid, PhotoCredit } from "@/components/collection/CategoryGrid";
import { FaqList } from "@/components/content/FaqList";
import { OrderSteps } from "@/components/content/OrderSteps";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChatIcon, CheckIcon, TruckIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/Photo";
import { faqGroups, featuredFaqIds } from "@/content/faq";
import { getCollections, getProducts } from "@/lib/commerce";
import { HERO_PHOTO } from "@/lib/commerce/presentation";
import { siteConfig } from "@/lib/config";
import styles from "./home.module.css";

export const revalidate = 3600;

export default async function HomePage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({ sort: "best-selling", limit: 8 }),
  ]);
  const featuredFaqs = faqGroups
    .flatMap((g) => g.items)
    .filter((item) => featuredFaqIds.includes(item.id));

  return (
    <div className="wrap">
      <section className={styles.hero}>
        <div>
          <p className="eyebrow">Our bestseller</p>
          <h1 className={styles.title}>
            Muddy paws,
            <br />
            <span className={styles.pink}>clean in seconds.</span>
          </h1>
          <p className="lead">
            The MimoPets Paw Washer lifts mud and dirt from every walk — no towels, no mess. Plus cozy
            comfort beds for cats and dogs who love to curl up.
          </p>
          <div className={styles.cta}>
            <Link className="btn btn-pink" href={`/products/${siteConfig.featuredProductHandle}`}>
              Shop the paw washer
            </Link>
            <Link className="btn btn-ghost" href="/collections">
              See all categories
            </Link>
          </div>
          <ul className={styles.trust}>
            <li>
              <CheckIcon />
              Our #1 bestseller
            </li>
            <li>
              <CheckIcon />
              For cats &amp; dogs
            </li>
            <li>
              <CheckIcon />
              Cozy comfort beds
            </li>
          </ul>
        </div>
        <div className={styles.art}>
          <div className={styles.blob} />
          <HeroIllustration className={styles.ill} />
          <Photo
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            fill
            preload
            sizes="(max-width: 860px) 360px, 460px"
            className={styles.photo}
          />
          <div className={`${styles.chip} ${styles.c1}`}>
            <span className={styles.dot}>
              <TruckIcon />
            </span>
            <span>
              <b>Clean paws, fast</b>
              <small>Our #1 bestseller</small>
            </span>
          </div>
          <div className={`${styles.chip} ${styles.c2}`}>
            <span className={styles.dot}>
              <ChatIcon />
            </span>
            <span>
              <b>A little extra love</b>
              <small>For every paw</small>
            </span>
          </div>
        </div>
      </section>

      <section className="block" id="categories" aria-labelledby="categories-title">
        <div className="head">
          <div>
            <p className="eyebrow">Categories</p>
            <h2 id="categories-title">Shop by category</h2>
          </div>
          <Link href="/collections" className="btn btn-ghost btn-sm">
            All categories
          </Link>
        </div>
        <CategoryGrid collections={collections} />
        <PhotoCredit />
      </section>

      <section className="block" id="products" aria-labelledby="products-title">
        <div className="head">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 id="products-title">
              {products.length === 3 ? "Three things" : "Things"} we truly believe in
            </h2>
            <p className="lead">A small, focused collection — starting with our bestselling paw washer.</p>
          </div>
          <Link href="/shop" className="btn btn-ghost btn-sm">
            Shop all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="block" id="how" aria-labelledby="how-title">
        <div className="head">
          <div>
            <p className="eyebrow">How to order</p>
            <h2 id="how-title">Ordering is easy</h2>
          </div>
          <Link href="/how-to-order" className="btn btn-ghost btn-sm">
            Learn more
          </Link>
        </div>
        <OrderSteps />
      </section>

      <section className="block" id="faq" aria-labelledby="faq-title">
        <div className="head">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title">A few helpful answers</h2>
          </div>
          <Link href="/faq" className="btn btn-ghost btn-sm">
            All questions
          </Link>
        </div>
        <FaqList items={featuredFaqs} />
      </section>
    </div>
  );
}
