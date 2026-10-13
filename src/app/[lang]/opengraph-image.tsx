import { ImageResponse } from "next/og";
import { HeroIllustration } from "@/components/art/Illustration";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/lib/config";
import { OgFrame, ogColors, ogContentType, ogFonts, ogSize } from "@/lib/og/frame";

/** Share image for every page in a language unless a page has its own. */
export const alt = siteConfig.name;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(hasLocale(lang) ? lang : "en");
  return new ImageResponse(
    (
      <OgFrame
        title={dict.home.titleLine1}
        accent={dict.home.titleLine2}
        detail={dict.brand.tagline}
        detailTone="muted"
        art={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 470,
              height: 470,
              borderRadius: "46% 54% 42% 58% / 52% 44% 56% 48%",
              background: ogColors.lilac,
            }}
          >
            <HeroIllustration width={430} height={430} />
          </div>
        }
      />
    ),
    { ...size, fonts: await ogFonts() },
  );
}
