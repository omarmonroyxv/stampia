import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Políticas de Reembolso y Devolución',
  description: 'Políticas de reembolso y devoluciones para productos personalizados en Stampia.',
}

export default function ReembolsosPage() {
  return (
    <div className="section-py pt-32">
      <div className="layout-container-narrow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-mk-ink">Políticas de Reembolso</h1>
        <div className="prose prose-lg text-gray-600 prose-a:text-mk-accent">
          <p className="lead text-xl">
            Debido a la naturaleza personalizada de nuestros productos (Print on Demand), cada artículo es impreso exclusivamente a solicitud del cliente tras confirmar su pedido. Por este motivo, nuestra política de devoluciones es estricta.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">1. Devoluciones por Productos Defectuosos o Erróneos</h2>
          <p>
            Nos hacemos 100% responsables si cometemos un error. Si recibes un producto que presenta algún defecto de fabricación en la prenda, un error evidente en la calidad de impresión, o si recibiste la talla o color equivocado, te ofreceremos un <strong>reemplazo sin costo</strong> o un <strong>reembolso total</strong>.
          </p>
          <p>
            Para procesar tu reclamo:
          </p>
          <ol>
            <li>Envíanos un correo a <strong>soporte@stampia.shop</strong> dentro de los primeros <strong>14 días naturales</strong> tras haber recibido el producto.</li>
            <li>Adjunta fotografías claras del problema, mostrando la prenda completa y un acercamiento al defecto o error.</li>
            <li>Incluye el número de tu orden.</li>
          </ol>
          <p>
            Una vez evaluado tu caso (usualmente en 24-48 horas hábiles), procederemos con la reposición inmediata o el reembolso a tu método de pago original.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">2. Remordimiento del Comprador y Errores de Talla</h2>
          <p>
            Dado que cada producto se imprime bajo demanda especialmente para ti, <strong>no aceptamos devoluciones ni cambios de talla por equivocación del cliente o remordimiento de compra.</strong>
          </p>
          <p>
            Te recomendamos revisar cuidadosamente la tabla de medidas (Guía de Tallas) disponible en la página de cada producto antes de confirmar tu pedido para asegurar que la prenda te ajustará perfectamente.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">3. Diseños de Baja Calidad</h2>
          <p>
            Tú eres responsable de la calidad de los archivos que subes a nuestra plataforma. Si el diseño enviado tiene baja resolución, está pixelado, o tiene fondos que no fueron removidos correctamente, no podremos ofrecer un reembolso o reemplazo. Te sugerimos subir archivos PNG en alta calidad (mínimo 300 DPI) con fondo transparente.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">4. Paquetes Devueltos al Remitente</h2>
          <p>
            Si la paquetería no logra entregar el paquete porque la dirección proporcionada era incorrecta, incompleta, o el destinatario estuvo ausente tras varios intentos, el paquete será devuelto a nuestro almacén. 
          </p>
          <p>
            En este caso, serás responsable de cubrir el costo de un nuevo envío. El paquete se retendrá en nuestro almacén por un máximo de 30 días naturales.
          </p>
          
          <p className="text-sm text-gray-400 mt-16">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
