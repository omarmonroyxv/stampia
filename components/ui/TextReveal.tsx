'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function TextReveal({ text, className = '', delay = 0, as: Tag = 'span' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.1, filter: 'blur(6px)', y: 10 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
