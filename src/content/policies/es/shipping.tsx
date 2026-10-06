import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { localizePath } from "@/i18n/config";
import { es } from "@/i18n/dictionaries/es";
import { getShipping } from "@/lib/content/shipping";

/** Spanish translation of `../en/shipping.tsx`. */
export function ShippingPolicy() {
  const shipping = getShipping("es", es);
  return (
    <>
      <p>
        Esta política explica cómo y cuándo se prepara y se entrega tu pedido de MimiPets. Si tienes
        alguna pregunta que no se responde aquí, <ContactLine lang="es" />.
      </p>

      <h2>Desde dónde se envía tu pedido</h2>
      <p>
        Nuestros productos se envían directamente desde el almacén de nuestro socio logístico en{" "}
        <strong>{shipping.shipsFrom}</strong>.
      </p>

      <h2>Plazo de preparación</h2>
      <p>
        Una vez que realizas tu pedido, se prepara para el envío en{" "}
        <strong>{shipping.processing.days}</strong> en el caso de {shipping.processing.share}.
      </p>

      <h2>Plazos de entrega estimados</h2>
      <p>Una vez enviado tu pedido, los plazos de entrega estimados son:</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Destino</th>
            <th scope="col">Método de envío</th>
            <th scope="col">Entrega estimada desde el envío</th>
          </tr>
        </thead>
        <tbody>
          {shipping.deliveryEstimates.map((e) => (
            <tr key={e.destination}>
              <td>{e.destination}</td>
              <td>{e.method}</td>
              <td>{e.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Para otros destinos, las opciones de envío disponibles para tu dirección se muestran al
        finalizar la compra. Los plazos de entrega son estimaciones de nuestro socio logístico y de
        las empresas de transporte, no garantías. Los periodos de mucha actividad, los controles de
        aduanas y los retrasos de los transportistas pueden añadir algo de tiempo de forma ocasional.
      </p>

      <h2>Gastos de envío</h2>
      <p>
        Los gastos de envío se calculan según tu dirección de entrega y se muestran al finalizar la
        compra, antes de pagar.
      </p>

      <h2>Confirmación del pedido y seguimiento</h2>
      <p>
        Recibirás un correo de confirmación del pedido en cuanto lo realices. Cuando se envíe, te
        mandaremos un correo de confirmación del envío, con los datos de seguimiento siempre que estén
        disponibles para tu método de envío.
      </p>

      <h2>Pedidos con varios artículos</h2>
      <p>
        Si pides más de un artículo, es posible que tus productos se envíen en paquetes separados y
        lleguen en días distintos.
      </p>

      <h2>Aranceles e impuestos de importación</h2>
      <p>
        Según tu país, pueden aplicarse aranceles o impuestos de importación. Cuando puedan cobrarse
        al finalizar la compra, se mostrarán allí antes de pagar.
      </p>

      <h2>Dirección de entrega</h2>
      <p>
        Comprueba que tu dirección de entrega esté completa y sea correcta antes de hacer el pedido.
        Si detectas un error, <ContactLine lang="es" /> de inmediato: una vez enviado el pedido, ya no
        podemos cambiar la dirección.
      </p>

      <h2>Paquetes retrasados, perdidos o dañados</h2>
      <p>
        Si tu paquete no ha llegado una vez pasado el plazo de entrega estimado, o llega dañado,
        contacta con nosotros e indica tu número de pedido (y adjunta una foto de los daños). Lo
        revisaremos con la empresa de transporte y, si un paquete se pierde o se daña durante el
        transporte, te enviaremos uno nuevo o te haremos un reembolso. Consulta nuestra{" "}
        <Link href={localizePath("es", "/policies/refund-policy")}>política de reembolsos</Link> para
        saber más sobre las devoluciones.
      </p>
    </>
  );
}
