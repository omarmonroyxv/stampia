import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

const QUOTES = [
  {
    text: 'Subí mi diseño y en una semana llegó la playera. La calidad superó mis expectativas.',
    name: 'Diego R.',
    city: 'Ciudad de México',
    initial: 'D',
  },
  {
    text: 'Por fin una plataforma que no te pide pedir 50 piezas. Ideal para artistas independientes.',
    name: 'Valeria M.',
    city: 'Guadalajara',
    initial: 'V',
  },
  {
    text: 'El proceso es súper intuitivo. Tardé menos de 10 minutos desde el diseño hasta el pago.',
    name: 'Carlos T.',
    city: 'Monterrey',
    initial: 'C',
  },
  {
    text: 'La impresión quedó perfecta, los colores son vibrantes y la tela es de buena calidad.',
    name: 'Ana L.',
    city: 'Querétaro',
    initial: 'A',
  },
  {
    text: 'Lo recomiendo 100%. Pedí 3 playeras para mi equipo y llegaron perfectas en tiempo récord.',
    name: 'Roberto V.',
    city: 'Puebla',
    initial: 'R',
  },
]

const DOUBLED = [...QUOTES, ...QUOTES]

export default function TestimonialsMarquee() {
  return (
    <section
      className="section-py border-b overflow-hidden"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="layout-container-narrow mb-14">
        <AnimateOnScroll>
          <p className="label-sm mb-4">Testimonios</p>
          <h2
            className="font-serif italic text-4xl md:text-5xl tracking-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Lo que dicen<br />nuestros clientes.
          </h2>
        </AnimateOnScroll>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }}
        />

        <div className="marquee-track">
          {DOUBLED.map((q, i) => (
            <div
              key={i}
              className="card flex-shrink-0 mx-4 p-8 flex flex-col justify-between"
              style={{ width: 340, minHeight: 220 }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-brand)">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>

              <p
                className="font-serif italic text-lg leading-relaxed flex-1"
                style={{ color: 'var(--color-text)' }}
              >
                &ldquo;{q.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-6 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
                  style={{ background: 'var(--color-brand)' }}
                >
                  {q.initial}
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                    {q.name}
                  </p>
                  <p className="label-sm mt-0.5">{q.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
