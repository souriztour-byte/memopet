import { ContactLine } from "@/components/content/ContactLine";
import { siteConfig } from "@/lib/config";
import { shipping } from "@/lib/content/shipping";

export function PrivacyPolicy() {
  const { businessName, businessAddress } = siteConfig.legal;
  const controller = businessName ?? siteConfig.name;
  return (
    <>
      <p>
        This policy explains what personal data {controller} (&ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects when you visit our website or buy from us, how we use it and the choices you have.
      </p>

      <h2>Who is responsible for your data</h2>
      <p>
        {controller} is responsible for your personal data
        {businessAddress ? <>. Our address is {businessAddress}</> : null}. For any privacy question
        or request, <ContactLine prefix="email us at" />.
      </p>

      <h2>What we collect</h2>
      <h3>When you browse our website</h3>
      <p>
        We use one essential cookie to remember what is in your cart. It contains a cart reference,
        not your name or contact details, and expires after 14 days. Our website does not use
        analytics or advertising cookies.
      </p>
      <p>
        Like any website, our hosting provider automatically processes technical information such as
        your IP address and browser type to deliver pages securely.
      </p>

      <h3>When you place an order</h3>
      <p>
        Our checkout is provided by Shopify. When you order, you give us your name, email address,
        delivery address, phone number (if you choose to add it) and payment details. Payments are
        handled by Shopify and its payment providers — we never see or store your full card number.
        Shopify&rsquo;s own handling of data is described in its{" "}
        <a href="https://www.shopify.com/legal/privacy" rel="noopener noreferrer" target="_blank">
          privacy policy
        </a>
        .
      </p>

      <h3>When you contact us</h3>
      <p>If you email or message us, we keep your message and contact details so we can reply.</p>

      <h2>How we use your data</h2>
      <ul>
        <li>To process, ship and support your order, including returns and refunds.</li>
        <li>To send you order and shipping confirmation emails.</li>
        <li>To answer your questions.</li>
        <li>To keep our website secure and to meet our legal and tax obligations.</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <strong>Shopify</strong>, which runs our checkout and stores order information.
        </li>
        <li>
          <strong>Our fulfilment partner and carriers</strong>, who need your name, delivery address
          and order details to ship your parcel. Because orders ship from {shipping.shipsFrom}, this
          information is transferred outside your country; we only share what is needed for
          delivery.
        </li>
        <li>
          <strong>Payment providers</strong>, to take payment and prevent fraud.
        </li>
        <li>Authorities, where the law requires it.</li>
      </ul>

      <h2>Legal bases</h2>
      <p>
        Where data-protection law such as the GDPR applies, we process your data to perform our
        contract with you (your order), to meet legal obligations (for example, keeping tax records),
        and for our legitimate interests in running a secure shop and answering your messages.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep order information for as long as needed to fulfil and support your order and to meet
        our legal and tax obligations. Messages are kept for as long as needed to deal with your
        request.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct or delete your
        personal data, to restrict or object to its use, and to receive a copy of it. To make a
        request, <ContactLine prefix="email us at" />. You also have the right to complain to your
        local data-protection authority.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top of this page shows when it
        last changed.
      </p>
    </>
  );
}
