import { ContactLine } from "@/components/content/ContactLine";
import { es } from "@/i18n/dictionaries/es";
import { siteConfig } from "@/lib/config";
import { getShipping } from "@/lib/content/shipping";

/** Spanish translation of `../en/privacy.tsx`. */
export function PrivacyPolicy() {
  const shipping = getShipping("es", es);
  const { businessName, businessAddress } = siteConfig.legal;
  const controller = businessName ?? siteConfig.name;
  return (
    <>
      <p>
        Esta política explica qué datos personales recoge {controller} (&laquo;nosotros&raquo;)
        cuando visitas nuestra web o nos compras, cómo los usamos y qué opciones tienes.
      </p>

      <h2>Responsable del tratamiento de tus datos</h2>
      <p>
        {controller} es responsable de tus datos personales
        {businessAddress ? <>. Nuestra dirección es {businessAddress}</> : null}. Para cualquier
        pregunta o solicitud sobre privacidad, <ContactLine lang="es" />.
      </p>

      <h2>Qué datos recogemos</h2>
      <h3>Cuando navegas por nuestra web</h3>
      <p>
        Usamos una cookie esencial para recordar lo que hay en tu carrito. Contiene una referencia
        del carrito, no tu nombre ni tus datos de contacto, y caduca a los 14 días. Nuestra web no usa
        cookies analíticas ni publicitarias.
      </p>
      <p>
        Como cualquier web, nuestro proveedor de alojamiento procesa automáticamente información
        técnica, como tu dirección IP y el tipo de navegador, para mostrar las páginas de forma
        segura.
      </p>

      <h3>Cuando haces un pedido</h3>
      <p>
        Nuestro proceso de pago lo proporciona Shopify. Cuando haces un pedido, nos facilitas tu
        nombre, tu dirección de correo electrónico, tu dirección de entrega, tu número de teléfono (si
        decides añadirlo) y tus datos de pago. Los pagos los gestionan Shopify y sus proveedores de
        pago: nunca vemos ni guardamos el número completo de tu tarjeta. El tratamiento de datos que
        hace Shopify se describe en su{" "}
        <a href="https://www.shopify.com/legal/privacy" rel="noopener noreferrer" target="_blank">
          política de privacidad
        </a>
        .
      </p>

      <h3>Cuando te pones en contacto con nosotros</h3>
      <p>
        Si nos escribes o nos envías un mensaje, guardamos tu mensaje y tus datos de contacto para
        poder responderte.
      </p>

      <h2>Cómo usamos tus datos</h2>
      <ul>
        <li>Para procesar, enviar y gestionar tu pedido, incluidas las devoluciones y los reembolsos.</li>
        <li>Para enviarte los correos de confirmación del pedido y del envío.</li>
        <li>Para responder a tus preguntas.</li>
        <li>
          Para mantener la seguridad de nuestra web y cumplir nuestras obligaciones legales y
          fiscales.
        </li>
      </ul>
      <p>No vendemos tus datos personales.</p>

      <h2>Con quién los compartimos</h2>
      <ul>
        <li>
          <strong>Shopify</strong>, que gestiona nuestro proceso de pago y almacena la información de
          los pedidos.
        </li>
        <li>
          <strong>Nuestro socio logístico y las empresas de transporte</strong>, que necesitan tu
          nombre, tu dirección de entrega y los datos del pedido para enviar tu paquete. Como los
          pedidos se envían desde {shipping.shipsFrom}, esta información se transfiere fuera de tu
          país; solo compartimos lo necesario para la entrega.
        </li>
        <li>
          <strong>Proveedores de pago</strong>, para cobrar el pago y prevenir el fraude.
        </li>
        <li>Las autoridades, cuando la ley lo exija.</li>
      </ul>

      <h2>Bases legales</h2>
      <p>
        Cuando se aplica la normativa de protección de datos, como el RGPD, tratamos tus datos para
        ejecutar nuestro contrato contigo (tu pedido), para cumplir obligaciones legales (por ejemplo,
        conservar los registros fiscales) y por nuestro interés legítimo en gestionar una tienda
        segura y responder a tus mensajes.
      </p>

      <h2>Cuánto tiempo los conservamos</h2>
      <p>
        Conservamos la información de los pedidos durante el tiempo necesario para tramitarlos y
        gestionarlos, y para cumplir nuestras obligaciones legales y fiscales. Los mensajes se
        conservan durante el tiempo necesario para atender tu solicitud.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Según dónde vivas, puedes tener derecho a acceder a tus datos personales, a rectificarlos o
        suprimirlos, a limitar su uso u oponerte a él, y a recibir una copia. Para hacer una
        solicitud, <ContactLine lang="es" />. También tienes derecho a presentar una reclamación ante
        la autoridad de protección de datos de tu país.
      </p>

      <h2>Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política de vez en cuando. La fecha que aparece al principio de esta
        página indica cuándo se modificó por última vez.
      </p>
    </>
  );
}
