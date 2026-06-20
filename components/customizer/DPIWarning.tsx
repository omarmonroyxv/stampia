import type { DPIValidation } from '@/types/domain'

export default function DPIWarning({ validation }: { validation: DPIValidation }) {
  const isOk   = validation.level === 'ok'
  const isWarn = validation.level === 'warn'

  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm
      ${isOk
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
    >
      <span className="shrink-0 font-bold text-base leading-none mt-px">
        {isOk ? '✓' : '⚠'}
      </span>
      <div>
        <p className="font-semibold text-xs">{isOk ? 'Calidad optima' : 'Calidad de imagen'}</p>
        <p className="text-xs mt-0.5 opacity-90">{validation.message}</p>
        {isWarn && (
          <p className="text-xs mt-1 font-medium">
            Puedes continuar el resultado final dependera de tu imagen.
          </p>
        )}
      </div>
    </div>
  )
}
