import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { siteConfig } from "@/lib/config";

export function TermsOfService() {
  const { businessName, businessAddress } = siteConfig.legal;
  const seller = businessName ?? siteConfig.name;
  return (
    <>
      <p>
        These terms apply when you use the {siteConfig.name} website and when you buy from us. Please
        read them before placing an order. By placing an order you agree to these terms.
      </p>

      <h2>1. About us</h2>
      <p>
        This website is operated by {seller}
        {businessAddress ? <>, {businessAddress}</> : null}. To reach us,{" "}
        <ContactLine prefix="email us at" />.
      </p>

      <h2>2. Products</h2>
      <p>
        We try to describe and show our products as accurately as possible. Colours can look slightly
        different on different screens, and product photos and illustrations are for guidance.
      </p>
      <p>
        Please use our products as intended and supervise your pet while using them. Stop using a
        product if it becomes damaged.
      </p>

      <h2>3. Prices and payment</h2>
      <p>
        Prices are shown in the currency displayed in our store. Shipping costs and any applicable
        taxes or duties are shown at checkout before you pay. Payment is taken through our secure
        Shopify checkout when you place your order.
      </p>
      <p>
        If we find an obvious pricing error, we&rsquo;ll contact you and you can choose to continue at
        the correct price or cancel for a full refund.
      </p>

      <h2>4. Your order</h2>
      <p>
        Our contract with you is formed when we email you your order confirmation. We may cancel an
        order — and refund you in full — if a product is unavailable or we are unable to deliver to
        your address. We&rsquo;ll let you know if this happens.
      </p>

      <h2>5. Shipping</h2>
      <p>
        Delivery times and details are explained in our{" "}
        <Link href="/policies/shipping-policy">shipping policy</Link>. Delivery times are estimates.
      </p>

      <h2>6. Cancellations, returns and refunds</h2>
      <p>
        Your right to cancel and how returns and refunds work are explained in our{" "}
        <Link href="/policies/refund-policy">refund policy</Link>.
      </p>

      <h2>7. Your personal data</h2>
      <p>
        We use your personal data as described in our{" "}
        <Link href="/policies/privacy-policy">privacy policy</Link>.
      </p>

      <h2>8. Our website</h2>
      <p>
        The content of this website, including text, graphics and the {siteConfig.name} name and
        logo, belongs to us or our licensors. You may not copy or reuse it for commercial purposes
        without our permission. We work to keep the website available and accurate, but can&rsquo;t
        guarantee it will always be uninterrupted or error-free.
      </p>

      <h2>9. Our responsibility to you</h2>
      <p>
        If we fail to meet these terms, we are responsible for loss or damage you suffer that is a
        foreseeable result of our failure. We are not responsible for loss or damage that is not
        foreseeable. Nothing in these terms limits or excludes our liability where it would be
        unlawful to do so, or affects your statutory rights as a consumer.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version on this page when you place your
        order is the one that applies to that order.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of the country in which {seller} is established. If you
        are a consumer, you also keep the protection of the mandatory laws of the country where you
        live, and you can bring a claim in the courts there.
      </p>
    </>
  );
}
