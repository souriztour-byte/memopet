import Link from "next/link";
import type { ReactNode } from "react";
import { ContactLine } from "@/components/content/ContactLine";
import { policySettings } from "@/lib/content/policy-settings";
import { primaryEstimate, shipping } from "@/lib/content/shipping";

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
  /** Plain-text answer for FAQPage structured data. */
  text: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  items: FaqItem[];
};

const { returnWindowDays } = policySettings;

export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    title: "Orders & payment",
    items: [
      {
        id: "how-to-order",
        question: "How do I place an order?",
        text: "Add the products you like to your cart, open the cart and select Checkout. You'll enter your delivery and payment details on our secure Shopify checkout, and we'll email you an order confirmation once your order is placed.",
        answer: (
          <p>
            Add the products you like to your cart, open the cart and select <strong>Checkout</strong>.
            You&rsquo;ll enter your delivery and payment details on our secure Shopify checkout, and
            we&rsquo;ll email you an order confirmation once your order is placed. See{" "}
            <Link href="/how-to-order">How to order</Link> for a step-by-step guide.
          </p>
        ),
      },
      {
        id: "payment-methods",
        question: "Which payment methods can I use?",
        text: "All available payment methods are shown at checkout. Payments are processed securely by Shopify and we never see or store your full card details.",
        answer: (
          <p>
            All available payment methods are shown at checkout. Payments are processed securely by
            Shopify and we never see or store your full card details.
          </p>
        ),
      },
      {
        id: "change-order",
        question: "Can I change or cancel my order?",
        text: "Contact us as soon as possible with your order number. If your order hasn't been processed yet we'll do our best to change or cancel it. Once it has shipped, you can still return it under our refund policy.",
        answer: (
          <p>
            Please <ContactLine prefix="email us at" /> as soon as possible with your order number. If
            your order hasn&rsquo;t been processed yet, we&rsquo;ll do our best to change or cancel it.
            Once it has shipped, you can still return it under our{" "}
            <Link href="/policies/refund-policy">refund policy</Link>.
          </p>
        ),
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    items: [
      {
        id: "ships-from",
        question: "Where do orders ship from?",
        text: `Our products are shipped from our fulfilment partner's warehouse in ${shipping.shipsFrom}.`,
        answer: (
          <p>
            Our products are shipped from our fulfilment partner&rsquo;s warehouse in{" "}
            {shipping.shipsFrom}.
          </p>
        ),
      },
      {
        id: "delivery-time",
        question: "How long will delivery take?",
        text: `Orders are usually prepared within ${shipping.processing.days} (${shipping.processing.share}). After dispatch, the estimated delivery time to ${primaryEstimate.destination} is ${primaryEstimate.days}. These are estimates, not guarantees.`,
        answer: (
          <>
            <p>
              Orders are usually prepared within <strong>{shipping.processing.days}</strong> (
              {shipping.processing.share}). After dispatch, the estimated delivery time to{" "}
              {primaryEstimate.destination} is <strong>{primaryEstimate.days}</strong>.
            </p>
            <p>
              These are estimates, not guarantees. Full details are in our{" "}
              <Link href="/policies/shipping-policy">shipping policy</Link>.
            </p>
          </>
        ),
      },
      {
        id: "shipping-cost",
        question: "How much does shipping cost?",
        text: "Shipping costs depend on your delivery address and are shown at checkout before you pay.",
        answer: <p>Shipping costs depend on your delivery address and are shown at checkout before you pay.</p>,
      },
      {
        id: "tracking",
        question: "Will I be able to track my order?",
        text: "Yes. When your order ships we'll send you a shipping confirmation email, including tracking details whenever they are available for your shipping method.",
        answer: (
          <p>
            When your order ships we&rsquo;ll send you a shipping confirmation email, including tracking
            details whenever they are available for your shipping method.
          </p>
        ),
      },
      {
        id: "multiple-packages",
        question: "Why did only part of my order arrive?",
        text: "If you order more than one item, your products may be shipped in separate packages and arrive on different days.",
        answer: (
          <p>
            If you order more than one item, your products may be shipped in separate packages and
            arrive on different days. If something is still missing after the estimated delivery
            time, <ContactLine prefix="email us at" />.
          </p>
        ),
      },
      {
        id: "customs",
        question: "Will I have to pay import duties or taxes?",
        text: "Depending on your country, import duties or taxes may apply to your order. Where these can be collected at checkout, they are shown there before you pay.",
        answer: (
          <p>
            Depending on your country, import duties or taxes may apply. Where these can be collected
            at checkout, they are shown there before you pay.
          </p>
        ),
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & refunds",
    items: [
      {
        id: "return-item",
        question: "Can I return an item?",
        text: `Yes. You can cancel your order and return items within ${returnWindowDays} days of receiving them, without giving a reason. Contact us first so we can send you return instructions.`,
        answer: (
          <p>
            Yes. You can cancel your order and return items within {returnWindowDays} days of
            receiving them, without giving a reason. Please contact us first so we can send you
            return instructions. Read the full{" "}
            <Link href="/policies/refund-policy">refund policy</Link>.
          </p>
        ),
      },
      {
        id: "damaged",
        question: "My item arrived damaged or isn't what I ordered. What should I do?",
        text: "We're sorry! Contact us as soon as possible with your order number and a photo of the problem, and we'll arrange a replacement or a full refund at no cost to you.",
        answer: (
          <p>
            We&rsquo;re sorry! Please <ContactLine prefix="email us at" /> as soon as possible with your
            order number and a photo of the problem, and we&rsquo;ll arrange a replacement or a full
            refund at no cost to you.
          </p>
        ),
      },
    ],
  },
  {
    id: "products",
    title: "Our products",
    items: [
      {
        id: "cats-or-dogs",
        question: "Is the Paw Washer for cats or dogs?",
        text: "Both. The Paw Washer is made for cats and dogs.",
        answer: <p>Both — the Paw Washer is made for cats and dogs.</p>,
      },
      {
        id: "paw-washer-sizes",
        question: "Which sizes does the Paw Washer come in?",
        text: "The Paw Washer comes in two sizes, S and M. If you're not sure which size suits your pet, message us before ordering and we'll help.",
        answer: (
          <p>
            It comes in two sizes, <strong>S</strong> and <strong>M</strong>. If you&rsquo;re not sure
            which size suits your pet, message us before ordering and we&rsquo;ll help.
          </p>
        ),
      },
      {
        id: "paw-washer-use",
        question: "How do I use the Paw Washer?",
        text: "Add a little water, place your pet's paw inside and gently move the cup so the silicone brush loosens mud and dirt. Then dry the paw. Afterwards, empty the cup, rinse it and let it dry.",
        answer: (
          <p>
            Add a little water, place your pet&rsquo;s paw inside and gently move the cup so the
            silicone brush loosens mud and dirt, then dry the paw. Afterwards, empty the cup, rinse it
            and let it dry.
          </p>
        ),
      },
    ],
  },
];

/** A few questions for the home page, like the prototype's FAQ block. */
export const featuredFaqIds = ["delivery-time", "return-item", "cats-or-dogs"];
