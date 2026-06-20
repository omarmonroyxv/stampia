'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatus, updateProductionStage, getPrintFileSignedUrl, retriggerFulfillment } from '@/lib/admin/actions'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type ProductionStage = 'dtf_printing' | 'dtf_pressing' | 'packing' | 'shipped_out' | null

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending',    label: 'Pendiente' },
  { value: 'paid',       label: 'Pagado' },
  { value: 'processing', label: 'En produccion' },
  { value: 'shipped',    label: 'Enviado' },
  { value: 'delivered',  label: 'Entregado' },
  { value: 'cancelled',  label: 'Cancelado' },
]

const STAGE_STEPS: { value: ProductionStage; label: string; desc: string }[] = [
  { value: 'dtf_printing', label: 'Imprimiendo DTF',  desc: 'Se esta imprimiendo la pelicula DTF' },
  { value: 'dtf_pressing', label: 'Pegando DTF',      desc: 'Termofijando a la prenda' },
  { value: 'packing',      label: 'Empaquetando',     desc: 'Preparando para envio' },
  { value: 'shipped_out',  label: 'Enviado',          desc: 'Salio del taller' },
]

interface PrintFileButtonProps {
  printFilePath: string
  itemId: string
}

export function PrintFileButton({ printFilePath, itemId }: PrintFileButtonProps) {
  const [loading, setLoading] = useState(false)
  async function handleDownload() {
    setLoading(true)
    const url = await getPrintFileSignedUrl(printFilePath)
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = 'print-' + itemId + '.png'
      a.click()
    }
    setLoading(false)
  }
  return (
    <button onClick={handleDownload} disabled={loading} className="text-xs text-brand hover:underline disabled:opacity-50 font-medium">
      {loading ? 'Generando...' : 'Descargar'}
    </button>
  )
}

interface StatusFormProps {
  orderId: string
  currentStatus: OrderStatus
  currentStage?: ProductionStage
}

export function StatusForm({ orderId, currentStatus, currentStage }: StatusFormProps) {
  const router = useRouter()
  const [selected, setSelected] = useState(currentStatus)
  const [activeStage, setActiveStage] = useState<ProductionStage>(currentStage ?? null)
  const [isPending, startTransition] = useTransition()
  const [isStagePending, startStageTransition] = useTransition()
  const [fulfillPending, startFulfillTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [stageSuccess, setStageSuccess] = useState(false)

  function handleStatusSave() {
    if (selected === currentStatus) return
    setError(null)
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, selected)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  function handleStageUpdate(stage: ProductionStage) {
    setActiveStage(stage)
    setError(null)
    setStageSuccess(false)
    startStageTransition(async () => {
      const result = await updateProductionStage(orderId, stage)
      if (result.error) setError(result.error)
      else {
        setStageSuccess(true)
        setTimeout(() => setStageSuccess(false), 2000)
        router.refresh()
      }
    })
  }

  function handleRetrigger() {
    setError(null)
    startFulfillTransition(async () => {
      const result = await retriggerFulfillment(orderId)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Status selector */}
      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Estado general</p>
        <div className="flex gap-2 items-center">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value as OrderStatus)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={handleStatusSave}
            disabled={isPending || selected === currentStatus}
            className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark disabled:opacity-40 transition-colors"
          >
            {isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Production stage tracker (visible when processing or paid) */}
      {(selected === 'processing' || selected === 'paid' || currentStatus === 'processing') && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Etapa de produccion
            </p>
            {stageSuccess && (
              <span className="text-xs text-green-600 font-semibold">Actualizado — el cliente lo ve en tiempo real</span>
            )}
            {isStagePending && (
              <span className="text-xs text-neutral-400">Actualizando...</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {STAGE_STEPS.map((stage) => {
              const isActive = activeStage === stage.value
              return (
                <button
                  key={stage.value as string}
                  onClick={() => handleStageUpdate(stage.value)}
                  disabled={isStagePending}
                  className="flex items-center gap-3 text-left rounded-xl px-4 py-3 transition-all disabled:opacity-50"
                  style={{
                    border: isActive ? '2px solid #ec3a12' : '1.5px solid #e5e7eb',
                    background: isActive ? 'rgba(236,58,18,0.05)' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? '#ec3a12' : '#f3f4f6',
                    border: isActive ? '2px solid #ec3a12' : '2px solid #d1d5db',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#ec3a12' : '#374151' }}>{stage.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{stage.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Retrigger fulfillment */}
      <button
        onClick={handleRetrigger}
        disabled={fulfillPending}
        className="self-start text-sm text-neutral-600 border border-neutral-300 px-4 py-2 rounded-lg hover:border-neutral-400 disabled:opacity-40 transition-colors"
      >
        {fulfillPending ? 'Enviando...' : 'Re-disparar fulfillment'}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  )
}
