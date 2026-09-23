import type { Metadata } from "next";
import Link from "next/link";
import { OrderSteps } from "@/components/content/OrderSteps";
import { PageIntro } from "@/components/content/PageIntro";
import { primaryEstimate, shipping } from "@/lib/content/shipping";

export const metadata: Metadata = {
  title: "How to order",
  description: "How ordering from MimoPets works, from cart to delivery.",
  alternates: { canonical: "/how-to-order" },
};

export default function HowToOrderPage() {
  return (
    <div className="wrap">
      <PageIntro
        eyebrow="How to order"
        title="From cart to doorstep"
        lead="Ordering takes just a few minutes. Here's how it works."
      />
      <section className="block" aria-label="Ordering steps">
        <OrderSteps />
      </section>

      <section className="block" aria-labelledby="after-title">
        <div className="head">
          <div>
            <p className="eyebrow">After you order</p>
            <h2 id="after-title">What happens next</h2>
          </div>
        </div>
        <ol className="how">
          <li className="step">
            <h3>Order confirmed</h3>
            <p>You&rsquo;ll receive an order confirmation email as soon as your order is placed.</p>
          </li>
          <li className="step">
            <h3>Prepared in {shipping.processing.days}</h3>
            <p>
              Your order is prepared for dispatch within {shipping.processing.days} for{" "}
              {shipping.processing.share}.
            </p>
          </li>
          <li className="step">
            <h3>On its way</h3>
            <p>
              We&rsquo;ll email you when it ships. Estimated delivery to {primaryEstimate.destination}{" "}
              is {primaryEstimate.days} after dispatch.
            </p>
          </li>
        </ol>
        <p className="small" style={{ marginTop: 18 }}>
          Read the full{" "}
          <Link href="/policies/shipping-policy" className="text-link">
            shipping policy
          </Link>{" "}
          or browse the{" "}
          <Link href="/faq" className="text-link">
            FAQ
          </Link>
          .
        </p>
      </section>

      <section className="block">
        <Link href="/shop" className="btn btn-pink">
          Start shopping
        </Link>
      </section>
    </div>
  );
}
