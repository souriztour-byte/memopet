import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WelcomeSignup } from "@/components/marketing/WelcomeSignup";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { hasLocale, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { I18nProvider } from "@/i18n/I18nProvider";
import { isDemoMode } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";
import "../globals.css";

// Serif display and sans body of the black & gold look. Both are variable
// fonts: loading them without a `weight` list fetches each file once (listing
// weights makes Google repeat the files, which breaks the Turbopack build).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
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
  themeColor: "#0F0E0D",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>
        <a className="skip" href="#main">
          {dict.common.skipToContent}
        </a>
        <I18nProvider lang={lang} dict={dict}>
          <CartProvider demoMode={isDemoMode()}>
            <Header />
            <main id="main">{children}</main>
            <WelcomeSignup />
            <Footer />
            <CartDrawer />
            <ScrollReveal />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
