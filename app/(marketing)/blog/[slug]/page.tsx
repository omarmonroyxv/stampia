import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { POSTS, getPost } from '@/lib/blog/posts'
import RegMarks from '@/components/marketing/RegMarks'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://stampia.shop/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://stampia.shop/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontFamily: 'var(--font-archivo)', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.75rem)', color: 'var(--ink)', marginTop: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '1rem', marginBottom: '0.5rem' }}>
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: '1rem', color: 'var(--smoke)', lineHeight: 1.7, marginBottom: '0.25rem', listStyleType: 'disc' }}>
              {item.replace(/\*\*(.*?)\*\*/g, '$1')}
            </li>
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith('| ')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('| ')) {
        if (!lines[i].includes('---')) {
          rows.push(lines[i].split('|').filter(Boolean).map((c) => c.trim()))
        }
        i++
      }
      elements.push(
        <div key={`tbl-${i}`} style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <thead>
              <tr>
                {rows[0]?.map((cell, j) => (
                  <th key={j} style={{ textAlign: 'left', padding: '10px 14px', background: 'var(--paper-2)', borderBottom: '2px solid var(--line)', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', color: 'var(--smoke)' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} style={{ borderLeft: '4px solid var(--cinnabar)', paddingLeft: '1.25rem', margin: '1.5rem 0', color: 'var(--smoke)', fontStyle: 'italic', fontSize: '1.0625rem' }}>
          {line.slice(2)}
        </blockquote>
      )
    } else if (line.trim() === '') {
      // skip empty lines
    } else {
      const parsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      elements.push(
        <p key={i} dangerouslySetInnerHTML={{ __html: parsed }} style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: 'var(--smoke)', marginBottom: '1.25rem' }} />
      )
    }
    i++
  }

  return <>{elements}</>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const others = POSTS.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <div className="section-py relative overflow-hidden">
      <RegMarks inset={24} />
      <div className="layout-container">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">

          {/* Article */}
          <article>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8" style={{ fontSize: '0.8125rem', color: 'var(--faint)' }}>
              <Link href="/blog" className="hover:text-[#EC3A12] transition-colors">Blog</Link>
              <span>/</span>
              <span style={{ color: 'var(--smoke)' }}>{post.category}</span>
            </div>

            {/* Header */}
            <div className="mb-10">
              <span className="mk-mono rounded-full px-3 py-1 mb-5 inline-block" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', background: 'rgba(236,58,18,0.08)', color: 'var(--cinnabar)' }}>
                {post.category.toUpperCase()}
              </span>
              <h1 className="mk-display" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'var(--ink)', lineHeight: 1.1, marginTop: '0.75rem' }}>
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mt-5">
                <span className="mk-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>
                  {new Date(post.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--line)', display: 'inline-block' }} />
                <span className="mk-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>
                  {post.readingTime} de lectura
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ borderTop: '1.5px solid var(--line)', paddingTop: '2.5rem' }}>
              {renderContent(post.content)}
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: 'var(--ink)', border: '1.5px solid var(--line)' }}>
              <p className="mk-spec mb-4" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>Stampia</p>
              <h3 className="mk-display mb-4" style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#fff' }}>
                ¿Listo para imprimir?
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                Sin pedido mínimo. Desde una pieza. Envío a todo México.
              </p>
              <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '13px 28px' }}>
                Ver catálogo
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="rounded-2xl p-6" style={{ border: '1.5px solid var(--line)', background: 'var(--paper)' }}>
              <p className="mk-spec mb-4">Más artículos</p>
              <div className="flex flex-col gap-4">
                {others.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-1.5">
                    <span className="mk-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--cinnabar)' }}>
                      {p.category.toUpperCase()}
                    </span>
                    <span className="group-hover:text-[#EC3A12] transition-colors" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                      {p.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, var(--cinnabar), #ff8a52)', border: '1.5px solid transparent' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                Sin pedido mínimo
              </p>
              <p style={{ fontSize: '1.125rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.3 }}>
                Imprime desde una sola pieza
              </p>
              <Link href="/catalog" style={{ display: 'inline-block', background: '#fff', color: 'var(--cinnabar)', fontWeight: 700, fontSize: '0.875rem', padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
                Empezar →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
