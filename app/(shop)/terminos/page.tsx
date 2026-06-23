import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de Stampia. Lee sobre nuestros lineamientos para compra e impresión.',
}

export default function TerminosPage() {
  return (
    <div className="section-py pt-32">
      <div className="layout-container-narrow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-mk-ink">Términos y Condiciones</h1>
        <div className="prose prose-lg text-gray-600 prose-a:text-mk-accent">
          <p className="lead text-xl">
            Bienvenido a Stampia. Al acceder y utilizar nuestro sitio web (stampia.shop), aceptas los siguientes términos y condiciones. Lee cuidadosamente esta sección antes de realizar cualquier pedido.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">1. Servicios Ofrecidos</h2>
          <p>
            Stampia ofrece un servicio de impresión bajo demanda (Print on Demand) utilizando tecnología de impresión digital directa (DTG). Los usuarios pueden subir sus propios diseños o elegir diseños predefinidos para ser impresos en prendas textiles y otros productos disponibles en nuestro catálogo.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">2. Propiedad Intelectual y Derechos de Autor</h2>
          <p>
            Al subir un diseño a nuestra plataforma, declaras bajo protesta de decir verdad que eres el propietario legal del diseño o tienes las licencias necesarias para su uso comercial. Stampia no se hace responsable por infracciones a derechos de autor, marcas registradas o propiedad intelectual de terceros cometidas por los usuarios.
          </p>
          <p>
            Nos reservamos el derecho de rechazar e cancelar cualquier pedido que contenga material que consideremos ofensivo, ilegal o que vulnere la propiedad intelectual de terceros.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">3. Condiciones de Compra y Pago</h2>
          <p>
            Todos los precios mostrados en el sitio están expresados en Pesos Mexicanos (MXN) e incluyen el Impuesto al Valor Agregado (IVA). Los pagos se procesan de forma segura a través de nuestros proveedores autorizados (Clip, MercadoPago, etc.).
          </p>
          <p>
            Al ser productos personalizados fabricados bajo demanda, el cobro se realiza en su totalidad al momento de confirmar el pedido. Una vez iniciado el proceso de producción, no es posible cancelar la orden.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">4. Errores Tipográficos o de Software</h2>
          <p>
            En caso de que un producto aparezca listado con un precio incorrecto o información errónea debido a un error tipográfico o un fallo del sistema, Stampia se reserva el derecho de rechazar o cancelar cualquier pedido realizado para dicho producto, reembolsando inmediatamente la cantidad pagada.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">5. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar o descontinuar temporal o permanentemente el servicio (o cualquier parte del mismo) con o sin previo aviso. También podemos modificar estos Términos y Condiciones en cualquier momento publicando la versión actualizada en esta página.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">6. Contacto Legal</h2>
          <p>
            Para cualquier asunto relacionado con estos Términos y Condiciones, puedes escribirnos a <strong>legal@stampia.shop</strong>.
          </p>
          
          <p className="text-sm text-gray-400 mt-16">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
