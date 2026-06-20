import Link from 'next/link'
import { POSTS } from '@/lib/blog/posts'

const CATEGORY_COLOR: Record<string, string> = {
  'Guías': '#2563eb',
  'Emprendimiento': '#7c3aed',
  'Eventos': '#059669',
}

export default function BlogPreviewSection() {
  const posts = POSTS.slice(0, 3)

  return (
    <section className="section-py" style={{ borderTop: '1.5px solid var(--line)', background: 'var(--paper)' }}>
      <div className="layout-container">

        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="mk-spec mb-3">Blog Stampia</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--ink)', lineHeight: 1.1 }}>
              Aprende sobre impresión<br />
              <span style={{ color: 'var(--cinnabar)' }}>y merch en México.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="mk-btn mk-btn-outline"
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Ver todos los artículos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {posts.map((post) => {
            const color = CATEGORY_COLOR[post.category] ?? 'var(--cinnabar)'
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ border: '1.5px solid var(--line)', background: '#fff', textDecoration: 'none' }}
              >
                {/* Category bar */}
                <div style={{ height: 3, borderRadius: 2, background: color, marginBottom: 18 }} />

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="mk-mono"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: 700, color, background: `${color}18`, padding: '3px 8px', borderRadius: 999 }}
                  >
                    {post.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>{post.readingTime}</span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {post.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--smoke)', lineHeight: 1.6, flex: 1 }}>
                  {post.description}
                </p>

                <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--faint)' }}>
                    {new Date(post.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--cinnabar)' }}>
                    Leer →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
