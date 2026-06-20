'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UploadResult {
  storagePath: string
  signedUrl: string
  widthPx: number
  heightPx: number
}

interface Props {
  userId: string
  onUpload: (result: UploadResult) => void
  disabled?: boolean
}

const ACCEPTED = 'image/png,image/jpeg,image/webp'

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = reject
    img.src = url
  })
}

export default function UploadZone({ userId, onUpload, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Solo se aceptan imágenes (PNG, JPG, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo excede 10 MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'png'
      const filename = `${crypto.randomUUID()}.${ext}`
      const path = `${userId}/${filename}`

      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: signedData, error: signError } = await supabase.storage
        .from('designs')
        .createSignedUrl(path, 3600)

      if (signError || !signedData) throw signError ?? new Error('No signed URL')

      const dims = await getImageDimensions(file)

      onUpload({
        storagePath: path,
        signedUrl: signedData.signedUrl,
        widthPx: dims.width,
        heightPx: dims.height,
      })
    } catch (err) {
      setError('Error al subir el archivo. Intenta de nuevo.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`w-full rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging
            ? 'border-brand bg-purple-50'
            : 'border-neutral-300 bg-neutral-50 hover:border-brand hover:bg-purple-50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm font-medium text-neutral-700">
            {uploading ? 'Subiendo…' : 'Sube tu diseño'}
          </span>
          <span className="text-xs text-neutral-400">PNG, JPG o WebP · Máx. 10 MB</span>
        </div>
      </button>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="sr-only"
        onChange={onInputChange}
      />
    </div>
  )
}
