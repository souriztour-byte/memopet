import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { localizePath } from "@/i18n/config";
import { es } from "@/i18n/dictionaries/es";
import { policySettings } from "@/lib/content/policy-settings";
import { getShipping } from "@/lib/content/shipping";
import type { FaqGroup } from "./types";

/** Spanish translation of `en.tsx` — same questions, same facts. */

const { returnWindowDays } = policySettings;
const shipping = getShipping("es", es);
const { primaryEstimate } = shipping;
const href = (path: string) => localizePath("es", path);

export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    title: "Pedidos y pago",
    items: [
      {
        id: "how-to-order",
        question: "¿Cómo hago un pedido?",
        text: "Añade al carrito los productos que te gusten, abre el carrito y selecciona Finalizar compra. Introducirás tus datos de entrega y de pago en nuestro proceso de pago seguro de Shopify y te enviaremos un correo de confirmación en cuanto realices el pedido.",
        answer: (
          <p>
            Añade al carrito los productos que te gusten, abre el carrito y selecciona{" "}
            <strong>Finalizar compra</strong>. Introducirás tus datos de entrega y de pago en nuestro
            proceso de pago seguro de Shopify y te enviaremos un correo de confirmación en cuanto
            realices el pedido. Consulta <Link href={href("/how-to-order")}>Cómo comprar</Link> para
            ver una guía paso a paso.
          </p>
        ),
      },
      {
        id: "payment-methods",
        question: "¿Qué métodos de pago puedo usar?",
        text: "Todos los métodos de pago disponibles se muestran al finalizar la compra. Shopify procesa los pagos de forma segura y nosotros nunca vemos ni guardamos los datos completos de tu tarjeta.",
        answer: (
          <p>
            Todos los métodos de pago disponibles se muestran al finalizar la compra. Shopify procesa
            los pagos de forma segura y nosotros nunca vemos ni guardamos los datos completos de tu
            tarjeta.
          </p>
        ),
      },
      {
        id: "change-order",
        question: "¿Puedo modificar o cancelar mi pedido?",
        text: "Contacta con nosotros lo antes posible e indica tu número de pedido. Si tu pedido aún no se ha procesado, haremos todo lo posible por modificarlo o cancelarlo. Si ya se ha enviado, puedes devolverlo según nuestra política de reembolsos.",
        answer: (
          <p>
            <ContactLine lang="es" capitalize /> lo antes posible e indica tu número de pedido. Si tu
            pedido aún no se ha procesado, haremos todo lo posible por modificarlo o cancelarlo. Si ya
            se ha enviado, puedes devolverlo según nuestra{" "}
            <Link href={href("/policies/refund-policy")}>política de reembolsos</Link>.
          </p>
        ),
      },
    ],
  },
  {
    id: "shipping",
    title: "Envíos y entrega",
    items: [
      {
        id: "ships-from",
        question: "¿Desde dónde se envían los pedidos?",
        text: `Nuestros productos se envían desde el almacén de nuestro socio logístico en ${shipping.shipsFrom}.`,
        answer: (
          <p>
            Nuestros productos se envían desde el almacén de nuestro socio logístico en{" "}
            {shipping.shipsFrom}.
          </p>
        ),
      },
      {
        id: "delivery-time",
        question: "¿Cuánto tarda la entrega?",
        text: `Los pedidos suelen prepararse en ${shipping.processing.days} (${shipping.processing.share}). Una vez enviados, el plazo de entrega estimado a ${primaryEstimate.destination} es de ${primaryEstimate.days}. Son estimaciones, no garantías.`,
        answer: (
          <>
            <p>
              Los pedidos suelen prepararse en <strong>{shipping.processing.days}</strong> (
              {shipping.processing.share}). Una vez enviados, el plazo de entrega estimado a{" "}
              {primaryEstimate.destination} es de <strong>{primaryEstimate.days}</strong>.
            </p>
            <p>
              Son estimaciones, no garantías. Encontrarás todos los detalles en nuestra{" "}
              <Link href={href("/policies/shipping-policy")}>política de envíos</Link>.
            </p>
          </>
        ),
      },
      {
        id: "shipping-cost",
        question: "¿Cuánto cuesta el envío?",
        text: "Los gastos de envío dependen de tu dirección de entrega y se muestran al finalizar la compra, antes de pagar.",
        answer: (
          <p>
            Los gastos de envío dependen de tu dirección de entrega y se muestran al finalizar la
            compra, antes de pagar.
          </p>
        ),
      },
      {
        id: "tracking",
        question: "¿Podré hacer el seguimiento de mi pedido?",
        text: "Sí. Cuando enviemos tu pedido, te mandaremos un correo de confirmación del envío, con los datos de seguimiento siempre que estén disponibles para tu método de envío.",
        answer: (
          <p>
            Cuando enviemos tu pedido, te mandaremos un correo de confirmación del envío, con los datos
            de seguimiento siempre que estén disponibles para tu método de envío.
          </p>
        ),
      },
      {
        id: "multiple-packages",
        question: "¿Por qué solo ha llegado una parte de mi pedido?",
        text: "Si pides más de un artículo, es posible que tus productos se envíen en paquetes separados y lleguen en días distintos.",
        answer: (
          <p>
            Si pides más de un artículo, es posible que tus productos se envíen en paquetes separados y
            lleguen en días distintos. Si todavía falta algo una vez pasado el plazo de entrega
            estimado, <ContactLine lang="es" />.
          </p>
        ),
      },
      {
        id: "customs",
        question: "¿Tendré que pagar aranceles o impuestos de importación?",
        text: "Según tu país, es posible que tu pedido esté sujeto a aranceles o impuestos de importación. Cuando puedan cobrarse al finalizar la compra, se mostrarán allí antes de pagar.",
        answer: (
          <p>
            Según tu país, pueden aplicarse aranceles o impuestos de importación. Cuando puedan
            cobrarse al finalizar la compra, se mostrarán allí antes de pagar.
          </p>
        ),
      },
    ],
  },
  {
    id: "returns",
    title: "Devoluciones y reembolsos",
    items: [
      {
        id: "return-item",
        question: "¿Puedo devolver un artículo?",
        text: `Sí. Puedes cancelar tu pedido y devolver los artículos en los ${returnWindowDays} días siguientes a recibirlos, sin necesidad de dar ningún motivo. Contacta antes con nosotros para que te enviemos las instrucciones de devolución.`,
        answer: (
          <p>
            Sí. Puedes cancelar tu pedido y devolver los artículos en los {returnWindowDays} días
            siguientes a recibirlos, sin necesidad de dar ningún motivo. Contacta antes con nosotros
            para que te enviemos las instrucciones de devolución. Lee la{" "}
            <Link href={href("/policies/refund-policy")}>política de reembolsos</Link> completa.
          </p>
        ),
      },
      {
        id: "damaged",
        question: "Mi artículo ha llegado dañado o no es lo que pedí. ¿Qué hago?",
        text: "¡Lo sentimos! Contacta con nosotros lo antes posible con tu número de pedido y una foto del problema, y te enviaremos uno nuevo o te reembolsaremos el importe completo, sin ningún coste para ti.",
        answer: (
          <p>
            ¡Lo sentimos! <ContactLine lang="es" capitalize /> lo antes posible con tu número de pedido
            y una foto del problema, y te enviaremos uno nuevo o te reembolsaremos el importe completo,
            sin ningún coste para ti.
          </p>
        ),
      },
    ],
  },
  {
    id: "products",
    title: "Nuestros productos",
    items: [
      {
        id: "cats-or-dogs",
        question: "¿El limpiapatas es para gatos o para perros?",
        text: "Para ambos. El limpiapatas está pensado para gatos y perros.",
        answer: <p>Para ambos: el limpiapatas está pensado para gatos y perros.</p>,
      },
      {
        id: "paw-washer-sizes",
        question: "¿En qué tallas está disponible el limpiapatas?",
        text: "El limpiapatas está disponible en dos tallas, S y M. Si no sabes qué talla le va mejor a tu mascota, escríbenos antes de hacer el pedido y te ayudaremos.",
        answer: (
          <p>
            Está disponible en dos tallas, <strong>S</strong> y <strong>M</strong>. Si no sabes qué
            talla le va mejor a tu mascota, escríbenos antes de hacer el pedido y te ayudaremos.
          </p>
        ),
      },
      {
        id: "paw-washer-use",
        question: "¿Cómo se usa el limpiapatas?",
        text: "Añade un poco de agua, introduce la pata de tu mascota y mueve el vaso con suavidad para que el cepillo de silicona afloje el barro y la suciedad. Después, seca la pata. Al terminar, vacía el vaso, acláralo y deja que se seque.",
        answer: (
          <p>
            Añade un poco de agua, introduce la pata de tu mascota y mueve el vaso con suavidad para que
            el cepillo de silicona afloje el barro y la suciedad; después, seca la pata. Al terminar,
            vacía el vaso, acláralo y deja que se seque.
          </p>
        ),
      },
    ],
  },
];
