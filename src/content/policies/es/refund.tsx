import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { localizePath } from "@/i18n/config";
import { policySettings } from "@/lib/content/policy-settings";

/** Spanish translation of `../en/refund.tsx`. */
export function RefundPolicy() {
  const days = policySettings.returnWindowDays;
  return (
    <>
      <p>
        Queremos que tú y tu mascota quedéis contentos con tu pedido. Esta política explica cómo
        cancelar un pedido, devolver un artículo y recibir un reembolso. No afecta a tus derechos
        legales como consumidor.
      </p>

      <h2>Tu derecho de desistimiento</h2>
      <p>
        Puedes cancelar tu pedido en un plazo de <strong>{days} días</strong> desde el día en que tú
        (o la persona que indiques) recibas los productos, sin necesidad de indicar ningún motivo. Si
        tu pedido llega en varios paquetes, los {days} días empiezan a contar desde el día en que
        recibas el último.
      </p>
      <p>
        Para cancelarlo, <ContactLine lang="es" /> indicando tu número de pedido y una declaración
        clara de que deseas cancelarlo. No es necesario usar ningún formulario concreto.
      </p>

      <h2>Cómo devolver los artículos</h2>
      <ul>
        <li>
          Contacta con nosotros antes de enviar nada, para que podamos darte la dirección de
          devolución.
        </li>
        <li>
          Envía los artículos en un plazo de {days} días desde que nos comuniques que quieres
          cancelar.
        </li>
        <li>
          Salvo que el artículo haya llegado dañado, defectuoso o equivocado, los gastos de devolución
          corren de tu cuenta.
        </li>
        <li>
          Mientras decides, manipula los artículos solo como lo harías en una tienda. Si un artículo
          se ha usado más de lo necesario para comprobarlo, podremos reducir tu reembolso en
          proporción a la pérdida de valor.
        </li>
      </ul>

      <h2>Tu reembolso</h2>
      <p>
        Te reembolsaremos el precio de los artículos devueltos y los gastos de envío estándar que
        pagaste en un plazo de 14 días desde que recibamos tu cancelación. Podemos esperar a recibir
        los artículos o a que nos demuestres que los has enviado, lo que ocurra primero.
      </p>
      <p>
        Los reembolsos se hacen con el mismo método de pago que usaste. Según tu banco o el emisor de
        tu tarjeta, el dinero puede tardar unos días más en aparecer en tu cuenta.
      </p>

      <h2>Artículos dañados, defectuosos o equivocados</h2>
      <p>
        Si tu artículo llega dañado o defectuoso, o no es lo que pediste,{" "}
        <ContactLine lang="es" /> lo antes posible con tu número de pedido y una foto del problema.
        Te enviaremos uno nuevo o te haremos un reembolso completo, incluidos los gastos de envío, sin
        ningún coste para ti. Esto se suma a tus derechos legales cuando un producto no se ajusta a su
        descripción o no es apto para su finalidad.
      </p>

      <h2>Paquetes perdidos</h2>
      <p>
        Si tu pedido no ha llegado una vez pasado el plazo de entrega estimado que figura en nuestra{" "}
        <Link href={localizePath("es", "/policies/shipping-policy")}>política de envíos</Link>,
        contacta con nosotros y te ayudaremos.
      </p>
    </>
  );
}
