import RegMarks from './RegMarks'

export default function PageHeader({
  eyebrow,
  title,
  accent,
  intro,
}: {
  eyebrow: string
  title: string
  accent?: string
  intro?: string
}) {
  return (
    <section className="relative overflow-hidden" style={{ borderBottom: '1.5px solid var(--line)' }}>
      <RegMarks inset={22} />
      <div className="layout-container" style={{ paddingTop: 80, paddingBottom: 64 }}>
        <p className="mk-spec mb-6">{eyebrow}</p>
        <h1 className="mk-display" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: 'var(--ink)', maxWidth: '16ch' }}>
          {title}
          {accent && <span style={{ color: 'var(--cinnabar)' }}> {accent}</span>}
        </h1>
        {intro && (
          <p className="mt-7" style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '40rem' }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  )
}
