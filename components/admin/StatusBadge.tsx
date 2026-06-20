const STATUS_CONFIG = {
  pending:    { label: 'Pendiente',   color: '#f59e0b' },
  paid:       { label: 'Pagado',      color: '#6c47ff' },
  processing: { label: 'En proceso',  color: '#3b82f6' },
  shipped:    { label: 'Enviado',     color: '#10b981' },
  delivered:  { label: 'Entregado',   color: '#059669' },
  cancelled:  { label: 'Cancelado',   color: '#ef4444' },
} as const

type Status = keyof typeof STATUS_CONFIG

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as Status] ?? { label: status, color: '#9ca3af' }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: `${config.color}15`, color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.color }}
      />
      {config.label}
    </span>
  )
}
