import Link from 'next/link'
import type { Metadata } from 'next'
import { POSTS } from '@/lib/blog/posts'
import RegMarks from '@/components/marketing/RegMarks'

export const metadata: Metadata = {
  title: 'Blog — Impresión y emprendimiento',
  description: 'Guías, tutoriales y consejos sobre impresión bajo demanda, lanzamiento de marcas y merch en México.',
  alternates: { canonical: 'https://stampia.shop/blog' },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Guías': '#EC3A12',
  'Emprendimiento': '#3B82F6',
  'Eventos': '#8B5CF6',
}

export default function BlogPage() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="section-py relative overflow-hidden">
      <RegMarks inset={24} />
      <div className="layout-container">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="mk-spec mb-5">Blog Stampia</p>
          <h1 className="mk-display" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', color: 'var(--ink)', lineHeight: 1.05 }}>
            Impresión,<br />
            <span style={{ color: 'var(--cinnabar)' }}>merch y marcas.</span>
          </h1>
          <p className="mt-6" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '32rem' }}>
            Guías prácticas para emprendedores, diseñadores y organizadores de eventos que quieren imprimir con calidad en México.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all hover:shadow-lg"
              style={{ border: '1.5px solid var(--line)', background: 'var(--paper)' }}
            >
              {/* Category band */}
              <div style={{ height: 4, background: CATEGORY_COLORS[post.category] ?? 'var(--cinnabar)' }} />

              <div className="flex flex-col gap-3 p-6 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="mk-mono rounded-full px-2.5 py-0.5"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.1em', background: `${CATEGORY_COLORS[post.category] ?? 'var(--cinnabar)'}18`, color: CATEGORY_COLORS[post.category] ?? 'var(--cinnabar)' }}
                  >
                    {post.category.toUpperCase()}
                  </span>
                  <span className="mk-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>
                    {post.readingTime}
                  </span>
                </div>

                <h2
                  className="group-hover:text-[#EC3A12] transition-colors"
                  style={{ fontFamily: 'var(--font-archivo)', fontWeight: 800, fontSize: '1.0625rem', color: 'var(--ink)', lineHeight: 1.3 }}
                >
                  {post.title}
                </h2>

                <p style={{ fontSize: '0.875rem', color: 'var(--smoke)', lineHeight: 1.6, flex: 1 }}>
                  {post.description}
                </p>

                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                  <span className="mk-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>
                    {new Date(post.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--cinnabar)', fontWeight: 700 }}>
                    Leer →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
