'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export default function NumberTicker({
  value,
  prefix = '',
  suffix = '',
  duration = 1600,
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        observer.disconnect()
        const startTime = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * value))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('es-MX')}{suffix}
    </span>
  )
}
