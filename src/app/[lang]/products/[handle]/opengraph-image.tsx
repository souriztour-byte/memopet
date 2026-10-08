import { ImageResponse } from "next/og";
import { Illustration } from "@/components/art/Illustration";
import { hasLocale } from "@/i18n/config";
import { getProduct } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { OgFrame, ogContentType, ogFonts, ogSize, ogTile } from "@/lib/og/frame";

/** Share image for a product: its photo (or illustration), name and price. */
export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ lang: string; handle: string }> }) {
  const { lang: raw, handle } = await params;
  const lang = hasLocale(raw) ? raw : "en";
  const product = await getProduct(lang, handle);
  const fonts = await ogFonts();
  if (!product) {
    return new ImageResponse(<OgFrame title={siteConfig.name} art={null} />, { ...size, fonts });
  }

  const { minVariantPrice: min, maxVariantPrice: max } = product.priceRange;
  const price =
    min.amount === max.amount ? formatMoney(min, lang) : `${formatMoney(min, lang)} – ${formatMoney(max, lang)}`;
  const photo = product.featuredImage;

  return new ImageResponse(
    (
      <OgFrame
        eyebrow={product.petType}
        title={product.title}
        detail={price}
        art={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 500,
              height: 500,
              borderRadius: 40,
              overflow: "hidden",
              background: ogTile[product.tile],
            }}
          >
            {photo ? (
              <img src={photo.url} alt="" width={500} height={500} style={{ objectFit: "cover" }} />
            ) : (
              <Illustration name={product.illustration} width={440} height={275} />
            )}
          </div>
        }
      />
    ),
    { ...size, fonts },
  );
}
