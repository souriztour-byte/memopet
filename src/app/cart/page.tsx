import type { Metadata } from "next";
import { PageIntro } from "@/components/content/PageIntro";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="wrap">
      <PageIntro eyebrow="Cart" title="Your cart" />
      <section className="block" aria-label="Cart contents">
        <CartPageContent />
      </section>
    </div>
  );
}
