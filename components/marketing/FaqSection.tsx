'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Reveal, stagger, item, VIEWPORT } from './motion-primitives'

const FAQS = [
  { q: '¿Hay pedido mínimo?', a: 'No. Imprime desde una sola pieza, al mismo precio por unidad. Sin mínimos ni cuotas de setup.' },
  { q: '¿Puedo lanzar mi propia marca de ropa con Stampia?', a: 'Sí. Muchos de nuestros clientes usan Stampia como taller de producción para sus marcas. Tú pones el diseño y el precio de venta; nosotros producimos y enviamos. No necesitas inventario ni inversión inicial — solo pagas por lo que vendes.' },
  { q: '¿Tienen descuentos por volumen?', a: 'Sí. A partir de 10 piezas aplican descuentos automáticos. Para pedidos de 50+ el descuento sube, y para 200+ piezas te hacemos una cotización personalizada con el precio por pieza más bajo posible. Contáctanos desde la sección de mayoreo.' },
  { q: '¿Puedo pedir merch para mi empresa o evento?', a: 'Claro. Atendemos pedidos corporativos, uniformes para equipos, merch para conciertos, conferencias y graduaciones. Desde 10 piezas. Escríbenos para coordinar tiempos y entrega.' },
  { q: '¿Cuánto tarda en llegar?', a: 'Entre 5 y 7 días hábiles a la mayoría de los destinos en México. Te enviamos guía de rastreo en cuanto sale del taller.' },
  { q: '¿Qué archivos puedo subir?', a: 'PNG o JPG. Recomendamos 150 DPI o más al tamaño de impresión (ideal 300 DPI). El editor te avisa si la resolución es baja.' },
  { q: '¿Cómo puedo pagar?', a: 'Tarjeta de crédito/débito, OXXO o SPEI. Proceso 100% seguro.' },
  { q: '¿La impresión se agrieta o despinta?', a: 'Usamos impresión DTF de alta definición que penetra la fibra. Con el cuidado de lavado adecuado, el diseño se mantiene vivo lavada tras lavada.' },
]

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div variants={item} className="mk-card overflow-hidden" style={{ borderRadius: 14 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
        style={{ padding: '20px 24px', background: 'none', border: 'none' }}
      >
        <span style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--ink)' }}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ flexShrink: 0, color: open ? 'var(--cinnabar)' : 'var(--smoke)' }}>
          <Plus size={22} strokeWidth={2.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ padding: '0 24px 22px', fontSize: '0.9875rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '52ch' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FaqSection() {
  return (
    <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
      <div className="layout-container-narrow">
        <Reveal className="mb-12 text-center">
          <p className="mk-spec mb-5" style={{ justifyContent: 'center' }}>Preguntas frecuentes</p>
          <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)' }}>
            Todo lo que necesitas <span style={{ color: 'var(--cinnabar)' }}>saber.</span>
          </h2>
        </Reveal>
        <motion.div className="flex flex-col gap-3" variants={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {FAQS.map((f) => <Item key={f.q} {...f} />)}
        </motion.div>
      </div>
    </section>
  )
}
