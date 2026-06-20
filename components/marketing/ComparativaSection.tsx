'use client'

import { motion } from 'framer-motion'
import { Reveal, stagger, item, VIEWPORT } from './motion-primitives'

const ROWS = [
  { label: 'Sin pedido mínimo', s: true, o: false },
  { label: 'Editor visual en línea', s: true, o: false },
  { label: 'Preview en tiempo real', s: true, o: false },
  { label: 'Pagos con OXXO y SPEI', s: true, o: false },
  { label: 'Envío a todo México', s: true, o: true },
]

function DrawCheck({ color }: { color: string }) {
  return (
    <motion.svg width="22" height="22" viewBox="0 0 24 24" fill="none" initial="hidden" whileInView="show" viewport={VIEWPORT} style={{ display: 'inline-block' }}>
      <motion.path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.15 } } }}
      />
    </motion.svg>
  )
}

export default function ComparativaSection() {
  return (
    <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
      <div className="layout-container-narrow">
        <Reveal className="mb-12">
          <p className="mk-spec mb-5">Comparativa</p>
          <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)' }}>
            Stampia vs. <span style={{ color: 'var(--cinnabar)' }}>el resto.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mk-card overflow-x-auto" style={{ borderRadius: 16 }}>
            <div style={{ minWidth: 320 }}>
              {/* Header */}
              <div className="grid items-center" style={{ gridTemplateColumns: '1.6fr 1fr 1fr', borderBottom: '1.5px solid var(--line)' }}>
                <span className="mk-spec" style={{ padding: '14px 16px', fontSize: '0.65rem' }}>Característica</span>
                <span className="mk-spec text-center" style={{ padding: '14px 10px', fontSize: '0.65rem', color: 'var(--cinnabar)', justifyContent: 'center', background: 'rgba(236,58,18,0.06)' }}>Stampia</span>
                <span className="mk-spec mk-spec-faint text-center" style={{ padding: '14px 10px', fontSize: '0.65rem', justifyContent: 'center' }}>Otros</span>
              </div>

              {/* Rows */}
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                {ROWS.map((r, i) => (
                  <motion.div
                    key={r.label}
                    variants={item}
                    className="mk-comp-row grid items-center"
                    style={{ gridTemplateColumns: '1.6fr 1fr 1fr', borderBottom: i < ROWS.length - 1 ? '1.5px solid var(--line)' : 'none' }}
                  >
                    <span style={{ padding: '14px 16px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>{r.label}</span>
                    <span className="flex justify-center" style={{ padding: '14px 10px', background: 'rgba(236,58,18,0.06)' }}>
                      {r.s ? <DrawCheck color="var(--cinnabar)" /> : <span style={{ color: 'var(--faint)' }}>—</span>}
                    </span>
                    <span className="flex justify-center" style={{ padding: '14px 10px' }}>
                      {r.o ? <DrawCheck color="var(--smoke)" /> : <span style={{ color: 'var(--faint)' }}>—</span>}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
