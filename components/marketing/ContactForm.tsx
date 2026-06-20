'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = '5215555555555' // TODO: reemplazar por el número real de Stampia

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && message.trim().length > 4

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    const text = `Hola, equipo Stampia.%0A%0ANombre: ${encodeURIComponent(name)}%0ACorreo: ${encodeURIComponent(email)}%0A%0A${encodeURIComponent(message)}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--paper)',
    border: '1.5px solid var(--line)',
    borderRadius: 4,
    padding: '12px 14px',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-public)',
    color: 'var(--ink)',
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--smoke)',
    marginBottom: 8,
  }

  return (
    <form onSubmit={handleSubmit} className="mk-card" style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="cf-name" style={labelStyle}>Nombre</label>
        <input id="cf-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre" style={fieldStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ink)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="cf-email" style={labelStyle}>Correo</label>
        <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com" style={fieldStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ink)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="cf-msg" style={labelStyle}>Mensaje</label>
        <textarea id="cf-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
          placeholder="Cuéntanos qué quieres imprimir…" style={{ ...fieldStyle, resize: 'vertical' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ink)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')} />
      </div>

      <button type="submit" disabled={!valid} className="mk-btn mk-btn-primary"
        style={{ width: '100%', justifyContent: 'center', opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}>
        Enviar por WhatsApp
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p className="mk-mono" style={{ fontSize: '0.6875rem', color: 'var(--faint)', textAlign: 'center', marginTop: 14, letterSpacing: '0.05em' }}>
        ABRIMOS WHATSAPP CON TU MENSAJE LISTO PARA ENVIAR
      </p>
    </form>
  )
}
