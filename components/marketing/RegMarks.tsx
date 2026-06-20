/* Registration crosshairs at the four corners of a section — the printer's
   plate-alignment mark, used here as Stampia's structural signature.
   Parent must be position: relative. Decorative only. */

function Cross() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="4" />
      <line x1="0" y1="8" x2="16" y2="8" />
      <line x1="8" y1="0" x2="8" y2="16" />
    </svg>
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
