import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  description: 'Aviso de Privacidad de Stampia. Conoce cómo protegemos y utilizamos tus datos personales en cumplimiento con la LFPDPPP.',
}

export default function PrivacidadPage() {
  return (
    <div className="section-py pt-32">
      <div className="layout-container-narrow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-mk-ink">Aviso de Privacidad</h1>
        <div className="prose prose-lg text-gray-600 prose-a:text-mk-accent">
          <p className="lead text-xl">
            En Stampia valoramos y respetamos tu privacidad. Este Aviso de Privacidad explica cómo recopilamos, usamos y protegemos tus datos personales, en cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">1. Datos que recopilamos</h2>
          <p>
            Recabamos los datos personales que tú mismo nos proporcionas al registrarte, al crear un pedido o al suscribirte a nuestros boletines. Estos datos pueden incluir:
          </p>
          <ul>
            <li>Nombre completo</li>
            <li>Dirección de envío y facturación</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Datos de navegación (cookies, dirección IP)</li>
          </ul>
          <p>
            No almacenamos información de tarjetas de crédito o débito. Todos los pagos son procesados de forma encriptada y segura a través de nuestros proveedores de pago (como Clip o MercadoPago).
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">2. Uso de tus datos</h2>
          <p>
            Tus datos personales serán utilizados exclusivamente para las siguientes finalidades esenciales:
          </p>
          <ul>
            <li>Procesar, imprimir y enviar tus pedidos a la dirección indicada.</li>
            <li>Enviarte notificaciones sobre el estado de tu pedido y números de guía.</li>
            <li>Proveer soporte técnico y servicio al cliente.</li>
            <li>Facturación y cobranza.</li>
          </ul>
          <p>
            De manera secundaria, podremos enviarte correos promocionales con ofertas exclusivas, de los cuales puedes darte de baja en cualquier momento.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">3. Protección y Transferencia de Datos</h2>
          <p>
            No vendemos, rentamos ni transferimos tus datos personales a terceros no relacionados con nuestro proceso logístico. Tu información solo es compartida con empresas de paquetería (ej. FedEx, Estafeta, DHL) estrictamente para cumplir con el envío de tus productos.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">4. Derechos ARCO</h2>
          <p>
            Como titular de los datos personales, tienes derecho a Acceder, Rectificar, Cancelar u Oponerte (Derechos ARCO) al uso de tu información en cualquier momento.
          </p>
          <p>
            Para ejercer estos derechos, por favor envía un correo electrónico a <strong>legal@stampia.shop</strong> con tu nombre, correo electrónico asociado a tu cuenta y el detalle de tu solicitud. Atenderemos tu petición en un plazo máximo de 20 días hábiles.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4 text-mk-ink">5. Uso de Cookies</h2>
          <p>
            Utilizamos cookies para mantener tu sesión activa, recordar los artículos en tu carrito de compras y analizar el tráfico de forma anónima para mejorar la experiencia de usuario. Puedes deshabilitar las cookies desde las configuraciones de tu navegador, aunque esto podría afectar la funcionalidad de la tienda.
          </p>
          
          <p className="text-sm text-gray-400 mt-16">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
