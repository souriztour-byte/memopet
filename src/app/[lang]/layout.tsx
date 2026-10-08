import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { hasLocale, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { I18nProvider } from "@/i18n/I18nProvider";
import { isDemoMode } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";
import "../globals.css";

// Same families and weights as the prototype.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
// Nunito Sans is a variable font: loading it without a `weight` list fetches the
// same files and covers the prototype's 400/600/700. Listing the weights makes
// Google repeat each file per weight, which breaks the Turbopack production build.
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { brand } = getDictionary(lang);
  const title = `${siteConfig.name} · ${brand.tagline}`;
  const description = fmt(brand.description, { name: siteConfig.name });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s · ${siteConfig.name}` },
    description,
    // Each page sets its own `alternates` (canonical + hreflang).
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      title,
      description,
    },
    // Title, description and image come from each page's Open Graph tags.
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6C4AB6",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${nunitoSans.variable}`}
    >
      <body>
        <a className="skip" href="#main">
          {dict.common.skipToContent}
        </a>
        <I18nProvider lang={lang} dict={dict}>
          <CartProvider demoMode={isDemoMode()}>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
