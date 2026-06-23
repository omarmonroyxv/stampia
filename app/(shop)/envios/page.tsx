import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Políticas de Envío',
  description: 'Conoce los tiempos de producción, métodos de envío y cobertura de Stampia en México.',
}

export default function EnviosPage() {
  return (
    <div className="section-py pt-32">
      <div className="layout-container-narrow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-mk-ink">Políticas de Envío</h1>
        <div className="prose prose-lg text-gray-600 prose-a:text-mk-accent">
          <p className="lead text-xl">
            En Stampia cada pedido se fabrica especialmente para ti. Al ser un servicio de impresión bajo demanda, los tiempos de entrega se componen de dos partes: tiempo de producción y tiempo de tránsito del envío.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">1. Tiempos de Producción</h2>
          <p>
            Nuestro modelo es "bajo demanda", lo que significa que la prenda se imprime una vez que el pedido ha sido pagado. 
          </p>
          <ul>
            <li><strong>Tiempo estimado de producción:</strong> 2 a 5 días hábiles.</li>
          </ul>
          <p>
            Durante temporadas de alta demanda (Buen Fin, Navidad, Hot Sale), los tiempos de producción pueden extenderse un poco debido al volumen de pedidos. Siempre te mantendremos informado sobre el estado de tu orden.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">2. Tiempos y Costos de Envío</h2>
          <p>
            Hacemos envíos a todo México a través de las mejores paqueterías (FedEx, Estafeta, DHL, Redpack). El costo de envío se calcula automáticamente en la pantalla de pago según tu código postal y el peso del paquete.
          </p>
          <ul>
            <li><strong>Envío Estándar:</strong> 3 a 5 días hábiles una vez que el paquete sale del taller.</li>
            <li><strong>Envío Exprés:</strong> 1 a 2 días hábiles (sujeto a disponibilidad según la zona).</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">3. Zonas Extendidas</h2>
          <p>
            Existen algunas poblaciones o códigos postales catalogados como "Zona Extendida" por las paqueterías debido a su difícil acceso. Si tu domicilio se encuentra en una zona extendida, el tiempo de tránsito puede aumentar y podría generarse un costo adicional. Te lo notificaremos antes del envío si este fuera el caso.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">4. Rastreo de Pedido</h2>
          <p>
            Una vez que tu pedido esté impreso y empaquetado, te enviaremos un correo electrónico con el número de guía para que puedas rastrearlo en tiempo real directamente en la página de la paquetería.
          </p>
          <p>
            También puedes ver el estatus en cualquier momento iniciando sesión y visitando la sección de <strong>Mis Órdenes</strong>.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">5. Paquetes Extraviados o Dañados</h2>
          <p>
            Si tu paquete llega abierto o presenta daño físico evidente, <strong>no lo recibas</strong> y repórtalo inmediatamente a la paquetería y a nuestro equipo. Si el paquete se marca como extraviado por la paquetería, nos haremos responsables y re-imprimiremos tu pedido sin costo adicional o te ofreceremos un reembolso total.
          </p>
          
          <p className="text-sm text-gray-400 mt-16">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
