'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  loadingLabel?: string
  className?: string
}

export default function SubmitButton({ label, loadingLabel = 'Cargando…', className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={className ?? "w-full bg-brand text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors"}
    >
      {pending ? loadingLabel : label}
    </button>
  )
}
