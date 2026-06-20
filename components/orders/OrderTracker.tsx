'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type ProductionStage = 'dtf_printing' | 'dtf_pressing' | 'packing' | 'shipped_out' | null

interface TrackerOrder {
  status: OrderStatus
  production_stage: ProductionStage
}

interface Step {
  id: string
  label: string
  sublabel: string
  icon: string
}

const STEPS: Step[] = [
  { id: 'paid',         label: 'Pago confirmado',  sublabel: 'Tu pedido fue recibido y confirmado', icon: 'check' },
  { id: 'dtf_printing', label: 'Imprimiendo DTF',  sublabel: 'Tu diseno se esta imprimiendo en pelicula DTF de alta definicion', icon: 'print' },
  { id: 'dtf_pressing', label: 'Pegando DTF',      sublabel: 'La pelicula se esta termofijando a tu prenda con calor', icon: 'fire' },
  { id: 'packing',      label: 'Empaquetando',     sublabel: 'Tu pedido se esta preparando para envio', icon: 'box' },
  { id: 'shipped',      label: 'En camino',        sublabel: 'Tu pedido salio del taller con guia de rastreo', icon: 'truck' },
  { id: 'delivered',    label: 'Entregado',        sublabel: 'Tu pedido fue entregado. Disfruta tu prenda!', icon: 'star' },
]

function getActiveStep(status: OrderStatus, stage: ProductionStage): number {
  if (status === 'delivered') return 5
  if (status === 'shipped')   return 4
  if (status === 'processing') {
    if (stage === 'packing')      return 3
    if (stage === 'dtf_pressing') return 2
    if (stage === 'dtf_printing') return 1
    return 1
  }
  if (status === 'paid') return 0
  return -1
}

function StepIcon({ icon, done, active }: { icon: string; done: boolean; active: boolean }) {
  if (done) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    )
  }
  const color = active ? 'var(--cinnabar)' : 'var(--line)'
  const icons: Record<string, React.ReactNode> = {
    check: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    print: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect x="6" y="14" width="12" height="8"/>
      </svg>
    ),
    fire: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    ),
    box: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    truck: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    star: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  }
  return <>{icons[icon]}</>
}

export default function OrderTracker({ orderId, initialStatus, initialStage }: {
  orderId: string
  initialStatus: OrderStatus
  initialStage: ProductionStage
}) {
  const [order, setOrder] = useState<TrackerOrder>({ status: initialStatus, production_stage: initialStage })
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('order-' + orderId)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'orders',
        filter: 'id=eq.' + orderId,
      }, (payload) => {
        const row = payload.new as Record<string, unknown>
        setOrder({
          status: row.status as OrderStatus,
          production_stage: (row.production_stage as ProductionStage) ?? null,
        })
        setPulse(true)
        setTimeout(() => setPulse(false), 1400)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  const activeStep = getActiveStep(order.status, order.production_stage)
  const isCancelled = order.status === 'cancelled'
  const progressPct = activeStep < 0 ? 0 : (activeStep / (STEPS.length - 1)) * 100

  if (isCancelled) {
    return (
      <div className="mk-card p-8 text-center" style={{ borderRadius: 18 }}>
        <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>✕</p>
        <p style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 6 }}>Pedido cancelado</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--smoke)' }}>Contactanos por WhatsApp si tienes dudas.</p>
      </div>
    )
  }

  return (
    <div
      className="mk-card p-8"
      style={{
        borderRadius: 18,
        transition: 'box-shadow 0.4s ease',
        boxShadow: pulse ? '0 0 0 3px rgba(236,58,18,0.25)' : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mk-spec mb-1">Progreso de tu pedido</p>
          <p style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--ink)' }}>
            {activeStep >= 0 ? STEPS[activeStep].label : 'Pendiente de pago'}
          </p>
          {activeStep >= 0 && (
            <p style={{ fontSize: '0.825rem', color: 'var(--smoke)', marginTop: 3 }}>
              {STEPS[activeStep].sublabel}
            </p>
          )}
        </div>
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          flexShrink: 0,
          background: order.status === 'delivered' ? '#10b981' : 'var(--cinnabar)',
          boxShadow: order.status === 'delivered'
            ? '0 0 0 5px rgba(16,185,129,0.18)'
            : '0 0 0 5px rgba(236,58,18,0.18)',
        }} />
      </div>

      {/* Progress bar (mobile-friendly) */}
      <div style={{ height: 4, background: 'var(--line)', borderRadius: 99, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: progressPct + '%',
          background: 'var(--cinnabar)',
          borderRadius: 99,
          transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'var(--line)', borderRadius: 99 }} />
        <div style={{
          position: 'absolute', left: 19, top: 20, width: 2,
          height: progressPct + '%',
          background: 'var(--cinnabar)',
          borderRadius: 99,
          transition: 'height 0.9s cubic-bezier(0.16,1,0.3,1)',
        }} />

        <div className="flex flex-col gap-5" style={{ position: 'relative' }}>
          {STEPS.map((step, i) => {
            const done    = i < activeStep
            const active  = i === activeStep
            const pending = i > activeStep
            return (
              <div key={step.id} className="flex items-center gap-4">
                {/* Circle */}
                <div style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? 'var(--cinnabar)' : 'var(--bg)',
                  border: done
                    ? '2px solid var(--cinnabar)'
                    : active
                    ? '2px solid var(--cinnabar)'
                    : '2px solid var(--line)',
                  boxShadow: active ? '0 0 0 5px rgba(236,58,18,0.12)' : 'none',
                  transition: 'all 0.4s ease',
                  position: 'relative', zIndex: 1,
                }}>
                  <StepIcon icon={step.icon} done={done} active={active} />
                </div>
                {/* Label */}
                <div style={{ opacity: pending ? 0.38 : 1, transition: 'opacity 0.4s ease' }}>
                  <p style={{
                    fontFamily: 'var(--font-public)',
                    fontWeight: active || done ? 700 : 500,
                    fontSize: '0.9rem',
                    color: active ? 'var(--cinnabar)' : 'var(--ink)',
                    lineHeight: 1.3,
                  }}>
                    {step.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
