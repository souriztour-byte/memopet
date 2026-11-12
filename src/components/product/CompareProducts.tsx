import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { isColourOption, isSizeOption, swatchFor } from "@/lib/commerce/presentation";
import type { ProductSummary } from "@/lib/commerce/types";
import { Price } from "./Price";
import { ProductMedia } from "./ProductMedia";
import styles from "./CompareProducts.module.css";

/**
 * Two or three similar products side by side: price, colours, sizes and who
 * they're for, all read from the products themselves. `currentHandle` marks
 * the product whose page this is on.
 */
export async function CompareProducts({
  products,
  currentHandle,
}: {
  products: ProductSummary[];
  currentHandle?: string;
}) {
  const { lang, dict } = await getI18n();
  const t = dict.product;
  const values = (p: ProductSummary, is: (name: string) => boolean) => p.options.find((o) => is(o.name))?.values ?? [];
  const rows = [
    {
      label: t.comparePrice,
      cell: (p: ProductSummary) => <Price min={p.priceRange.minVariantPrice} max={p.priceRange.maxVariantPrice} />,
    },
    {
      label: t.compareColours,
      cell: (p: ProductSummary) => {
        const colours = values(p, isColourOption);
        return colours.length ? (
          <ul className={styles.colours}>
            {colours.map((c) => (
              <li key={c}>
                {swatchFor(c) ? <span style={{ background: swatchFor(c)! }} aria-hidden="true" /> : null}
                {c}
              </li>
            ))}
          </ul>
        ) : (
          "—"
        );
      },
    },
    { label: t.compareSizes, cell: (p: ProductSummary) => values(p, isSizeOption).join(" · ") || "—" },
    { label: t.compareFor, cell: (p: ProductSummary) => p.petType ?? "—" },
  ];

  return (
    <div className={styles.scroll}>
      <table className={styles.table} style={{ "--cols": products.length } as React.CSSProperties}>
        <caption className="sr-only">{t.compareLabel2}</caption>
        <thead>
          <tr>
            <td />
            {products.map((p) => (
              <th key={p.id} scope="col" data-current={p.handle === currentHandle || undefined}>
                <span className={`${styles.pic} soft-frame ${p.tile}`}>
                  <ProductMedia image={p.featuredImage} illustration={p.illustration} alt="" sizes="220px" />
                </span>
                <span className={styles.name}>{p.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {products.map((p) => (
                <td key={p.id} data-current={p.handle === currentHandle || undefined}>
                  {row.cell(p)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td />
            {products.map((p) => (
              <td key={p.id} data-current={p.handle === currentHandle || undefined}>
                {p.handle === currentHandle ? (
                  <span className={styles.here}>{t.compareThis}</span>
                ) : (
                  <Link
                    href={localizePath(lang, `/products/${p.handle}`)}
                    className="btn btn-ghost btn-sm"
                    aria-label={`${t.compareView}: ${p.title}`}
                  >
                    {t.compareView}
                  </Link>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
