'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { GlowingShadow } from '@/components/ui/glowing-shadow'

interface AccordionItemData {
  id: number
  title: string
  imageUrl: string
}

/* Real product categories. Drop your own photos in /public/showcase/ to replace
   these, or pass a custom `items` array. Falls back to a branded placeholder. */
const DEFAULT_ITEMS: AccordionItemData[] = [
  { id: 1, title: 'Playeras', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop' },
  { id: 2, title: 'Sudaderas', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop' },
  { id: 3, title: 'Tote bags', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, title: 'Gorras', imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop' },
  { id: 5, title: 'Tu diseño', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop' },
]

const FALLBACK = 'https://placehold.co/400x450/14110e/ec3a12?text=Stampia&font=montserrat'

function AccordionItem({
  item,
  isActive,
  onActivate,
}: {
  item: AccordionItemData
  isActive: boolean
  onActivate: () => void
}) {
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-label={item.title}
      aria-pressed={isActive}
      className={`relative h-[420px] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] flex-shrink-0 ${isActive ? 'w-[360px]' : 'w-[60px]'}`}
      style={{ borderRadius: 8, border: '1.5px solid var(--line)' }}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const img = e.currentTarget
          img.onerror = null
          img.src = FALLBACK
        }}
      />
      {/* Ink gradient for legibility */}
      <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,14,0.1) 0%, rgba(20,17,14,0.75) 100%)' }} />

      {/* Active accent bar */}
      <span
        className="absolute bottom-0 left-0 h-1 transition-all duration-700"
        style={{ width: isActive ? '100%' : '0%', background: 'var(--cinnabar)' }}
      />

      {/* Caption */}
      <span
        className={`absolute whitespace-nowrap transition-all duration-500 mk-display ${isActive ? 'bottom-5 left-6 rotate-0' : 'bottom-20 left-1/2 -translate-x-1/2 rotate-90'}`}
        style={{ color: '#fff', fontSize: isActive ? '1.5rem' : '1.05rem' }}
      >
        {item.title}
      </span>
    </button>
  )
}

export function LandingAccordionItem({ items = DEFAULT_ITEMS }: { items?: AccordionItemData[] }) {
  const [activeIndex, setActiveIndex] = useState(items.length - 1)

  return (
    <section className="section-py" style={{ borderBottom: '1.5px solid var(--line)', background: 'var(--paper)' }}>
      <div className="layout-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left: text */}
          <div className="w-full lg:w-[42%]">
            <p className="mk-spec mb-5">Qué puedes imprimir</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: 'var(--ink)' }}>
              Imprime en lo<br /><span style={{ color: 'var(--cinnabar)' }}>que imagines.</span>
            </h2>
            <p className="mt-6" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '30rem' }}>
              Playeras, sudaderas, tote bags, gorras y más. Tú pones el diseño;
              nosotros lo imprimimos con calidad de taller sobre la prenda que elijas.
            </p>
            <GlowingShadow className="mt-8">
              <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                Ver catálogo
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </GlowingShadow>
          </div>

          {/* Right: accordion — desktop only; mobile shows a simple grid */}
          <div className="w-full lg:w-[58%]">
            {/* Mobile grid */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {items.slice(0, 4).map((item) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '3/4', border: '1.5px solid var(--line)' }}>
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { const img = e.currentTarget; img.onerror = null; img.src = FALLBACK }} />
                  <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,14,0.05) 0%, rgba(20,17,14,0.65) 100%)' }} />
                  <span className="absolute bottom-3 left-4 mk-display text-white" style={{ fontSize: '1rem' }}>{item.title}</span>
                </div>
              ))}
            </div>
            {/* Desktop accordion */}
            <div className="hidden lg:flex flex-row items-center justify-end gap-3">
              {items.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onActivate={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
