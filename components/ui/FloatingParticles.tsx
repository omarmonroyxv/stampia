'use client'

import { motion } from 'framer-motion'

const DOTS = [
  { x: '8%',  y: '20%', size: 3,   dur: 7,  del: 0   },
  { x: '20%', y: '75%', size: 2,   dur: 9,  del: 1.5 },
  { x: '35%', y: '40%', size: 1.5, dur: 11, del: 3   },
  { x: '55%', y: '15%', size: 4,   dur: 8,  del: 0.8 },
  { x: '68%', y: '60%', size: 2,   dur: 10, del: 2.2 },
  { x: '80%', y: '30%', size: 3,   dur: 6,  del: 1.2 },
  { x: '90%', y: '80%', size: 2.5, dur: 12, del: 3.5 },
  { x: '45%', y: '85%', size: 2,   dur: 9,  del: 0.5 },
  { x: '12%', y: '55%', size: 1.5, dur: 8,  del: 4   },
  { x: '72%', y: '10%', size: 3,   dur: 7,  del: 2.8 },
]

interface Props {
  opacity?: number
  color?: string
}

export default function FloatingParticles({ opacity = 0.35, color = '#ffffff' }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {DOTS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: color,
            opacity,
          }}
          animate={{ y: [-10, 10], opacity: [opacity * 0.5, opacity] }}
          transition={{
            duration: d.dur,
            delay: d.del,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
