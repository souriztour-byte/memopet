import Link from "next/link";
import { Illustration } from "@/components/art/Illustration";
import { ProductGrid } from "@/components/product/ProductGrid";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { getProducts } from "@/lib/commerce";
import styles from "./status.module.css";

export default async function NotFound() {
  const { lang, dict } = await getI18n();
  // A wrong address still leads somewhere: the collection sits under the message.
  const products = await getProducts(lang, {
    sort: "best-selling",
    limit: 4,
  }).catch(() => []);
  return (
    <>
      <div className={`wrap ${styles.status}`}>
        <div className={`${styles.art} t1`}>
          <Illustration name="toys" />
        </div>
        <p className="eyebrow">{dict.notFound.eyebrow}</p>
        <h1>{dict.notFound.title}</h1>
        <p className="lead">{dict.notFound.lead}</p>
        <div className={styles.actions}>
          <Link href={localizePath(lang, "/")} className="btn btn-gold">
            {dict.common.backHome}
          </Link>
          <Link href={localizePath(lang, "/shop")} className="btn btn-ghost">
            {dict.common.shopAll}
          </Link>
        </div>
      </div>
      {products.length ? (
        <div className="wrap">
          <section className="block" aria-labelledby="notfound-picks-title">
            <div className="head">
              <h2 id="notfound-picks-title">{dict.header.searchPopular}</h2>
            </div>
            <ProductGrid products={products} />
          </section>
        </div>
      ) : null}
    </>
  );
}
