import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { WelcomeSignup } from "@/components/marketing/WelcomeSignup";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { hasLocale, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getProducts, isDemoMode } from "@/lib/commerce";
import { look, lookColor, siteConfig } from "@/lib/config";
import "../globals.css";

// Playfair Display for headings and the wordmark, Inter for text. Both are
// variable fonts: loading them without a `weight` list fetches each file once
// (listing weights makes Google repeat the files, which breaks the Turbopack build).
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  themeColor: lookColor[look],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const catalogue = await getProducts(lang, { sort: "best-selling", limit: 8 });

  return (
    <html
      lang={lang}
      data-theme={look}
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body>
        <a className="skip" href="#main">
          {dict.common.skipToContent}
        </a>
        <I18nProvider lang={lang} dict={dict}>
          <CartProvider demoMode={isDemoMode()} suggestions={catalogue}>
            <Header />
            <main id="main">{children}</main>
            <WelcomeSignup />
            <Footer />
            <TabBar />
            <CartDrawer />
            <ScrollReveal />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
