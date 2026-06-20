/* Registration crosshairs at the four corners of a section — the printer's
   plate-alignment mark, used here as Stampia's structural signature.
   Parent must be position: relative. Decorative only. */

function Cross() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/nuevofavi.png" alt="" width={16} height={16} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
  )
}

export default function RegMarks({ inset = 20 }: { inset?: number }) {
  const corners = [
    { top: inset, left: inset },
    { top: inset, right: inset },
    { bottom: inset, left: inset },
    { bottom: inset, right: inset },
  ]
  return (
    <>
      {corners.map((pos, i) => (
        <span
          key={i}
          className="mk-regmark"
          style={{ position: 'absolute', zIndex: 1, ...pos }}
        >
          <Cross />
        </span>
      ))}
    </>
  )
}
