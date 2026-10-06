import Link from "next/link";
import { ContactLine } from "@/components/content/ContactLine";
import { localizePath } from "@/i18n/config";
import { siteConfig } from "@/lib/config";

const href = (path: string) => localizePath("es", path);

/** Spanish translation of `../en/terms.tsx`. */
export function TermsOfService() {
  const { businessName, businessAddress } = siteConfig.legal;
  const seller = businessName ?? siteConfig.name;
  return (
    <>
      <p>
        Estos términos se aplican cuando usas la web de {siteConfig.name} y cuando nos compras. Léelos
        antes de hacer un pedido. Al hacer un pedido, aceptas estos términos.
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        Esta web la gestiona {seller}
        {businessAddress ? <>, {businessAddress}</> : null}. Para contactar con nosotros,{" "}
        <ContactLine lang="es" />.
      </p>

      <h2>2. Productos</h2>
      <p>
        Intentamos describir y mostrar nuestros productos con la mayor exactitud posible. Los colores
        pueden verse ligeramente distintos según la pantalla, y las fotos e ilustraciones de los
        productos son orientativas.
      </p>
      <p>
        Usa nuestros productos para su finalidad prevista y vigila a tu mascota mientras los usa. Deja
        de usar un producto si se daña.
      </p>

      <h2>3. Precios y pago</h2>
      <p>
        Los precios se muestran en la moneda que aparece en nuestra tienda. Los gastos de envío y los
        impuestos o aranceles aplicables se muestran al finalizar la compra, antes de pagar. El pago
        se realiza a través de nuestro proceso de pago seguro de Shopify cuando haces el pedido.
      </p>
      <p>
        Si detectamos un error evidente en un precio, nos pondremos en contacto contigo y podrás elegir
        entre continuar con el precio correcto o cancelar el pedido y recibir un reembolso completo.
      </p>

      <h2>4. Tu pedido</h2>
      <p>
        Nuestro contrato contigo se formaliza cuando te enviamos por correo la confirmación del pedido.
        Podemos cancelar un pedido, y reembolsarte el importe completo, si un producto no está
        disponible o no podemos entregarlo en tu dirección. Te avisaremos si esto ocurre.
      </p>

      <h2>5. Envíos</h2>
      <p>
        Los plazos y detalles de entrega se explican en nuestra{" "}
        <Link href={href("/policies/shipping-policy")}>política de envíos</Link>. Los plazos de
        entrega son estimaciones.
      </p>

      <h2>6. Cancelaciones, devoluciones y reembolsos</h2>
      <p>
        Tu derecho de desistimiento y cómo funcionan las devoluciones y los reembolsos se explican en
        nuestra <Link href={href("/policies/refund-policy")}>política de reembolsos</Link>.
      </p>

      <h2>7. Tus datos personales</h2>
      <p>
        Usamos tus datos personales tal como se describe en nuestra{" "}
        <Link href={href("/policies/privacy-policy")}>política de privacidad</Link>.
      </p>

      <h2>8. Nuestra web</h2>
      <p>
        El contenido de esta web, incluidos los textos, los gráficos y el nombre y el logotipo de{" "}
        {siteConfig.name}, nos pertenece a nosotros o a nuestros licenciantes. No puedes copiarlo ni
        reutilizarlo con fines comerciales sin nuestro permiso. Trabajamos para que la web esté
        disponible y sea precisa, pero no podemos garantizar que funcione siempre sin interrupciones
        ni errores.
      </p>

      <h2>9. Nuestra responsabilidad frente a ti</h2>
      <p>
        Si incumplimos estos términos, somos responsables de las pérdidas o daños que sufras y que
        sean una consecuencia previsible de nuestro incumplimiento. No somos responsables de las
        pérdidas o daños que no sean previsibles. Nada de lo dispuesto en estos términos limita ni
        excluye nuestra responsabilidad cuando hacerlo sea ilegal, ni afecta a tus derechos legales
        como consumidor.
      </p>

      <h2>10. Cambios en estos términos</h2>
      <p>
        Podemos actualizar estos términos de vez en cuando. La versión que aparezca en esta página
        cuando hagas tu pedido es la que se aplica a ese pedido.
      </p>

      <h2>11. Legislación aplicable</h2>
      <p>
        Estos términos se rigen por las leyes del país en el que {seller} está establecido. Si eres
        consumidor, también conservas la protección de las leyes imperativas del país en el que vives
        y puedes presentar una reclamación ante sus tribunales.
      </p>
    </>
  );
}
