'use client'

import { cn } from '@/lib/utils'
import { Quote } from 'lucide-react'

export interface DisplayCardProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  date?: string
  dimmed?: boolean
}

function DisplayCard({
  className,
  icon = <Quote size={15} strokeWidth={2.5} />,
  title = 'Cliente',
  description = '',
  date = '',
  dimmed = false,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        'group relative flex h-44 w-[17rem] sm:w-[21rem] -skew-y-[8deg] select-none flex-col justify-between overflow-hidden rounded-xl px-5 py-4 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]',
        className,
      )}
      style={{ background: 'var(--paper)', border: '1.5px solid var(--line)', boxShadow: '0 16px 44px rgba(20,17,14,0.12)' }}
    >
      {/* Dim layer on the back cards — lifts on hover to "bring the step forward" */}
      {dimmed && (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-10 transition-opacity duration-700 group-hover:opacity-0"
          style={{ background: 'rgba(243,239,230,0.66)' }}
        />
      )}

      <div className="relative flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: 'rgba(236,58,18,0.1)', color: 'var(--cinnabar)' }}>
          {icon}
        </span>
        <p className="mk-display" style={{ fontSize: '1.15rem', color: 'var(--ink)' }}>{title}</p>
      </div>
      <p className="relative" style={{ fontSize: '0.95rem', lineHeight: 1.45, color: '#2a251f' }}>{description}</p>
      <p className="relative mk-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--cinnabar)' }}>{date}</p>
    </div>
  )
}

const POSITIONS = [
  '[grid-area:stack] hover:-translate-y-10 hover:z-20',
  '[grid-area:stack] translate-x-14 translate-y-9 hover:-translate-y-1 hover:z-20',
  '[grid-area:stack] translate-x-28 translate-y-[4.5rem] hover:translate-y-9 hover:z-20',
]

export interface DisplayCardsProps {
  cards?: DisplayCardProps[]
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const list = cards ?? [{}, {}, {}]
  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {list.map((card, i) => (
        <DisplayCard
          key={i}
          {...card}
          dimmed={card.dimmed ?? i < list.length - 1}
          className={cn(POSITIONS[i % 3], card.className)}
        />
      ))}
    </div>
  )
}
