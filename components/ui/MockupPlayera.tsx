import type { CSSProperties } from 'react'

interface Props {
  color?:     string
  className?: string
  style?:     CSSProperties
  /** Optional design image URL to overlay on the print area */
  designUrl?: string
}

/**
 * Realistic t-shirt SVG mockup with fabric folds, seams, stitching detail,
 * a neck label zone and an optional design overlay.
 */
export default function MockupPlayera({ color = '#FFFFFF', className, style, designUrl }: Props) {
  // Determine if shirt is light or dark for overlay contrast
  const isDark = isColorDark(color)
  const shadowTint = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.07)'
  const foldTint = isDark
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(0,0,0,0.04)'
  const seamColor = isDark
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(0,0,0,0.10)'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 400 480"
      fill="none"
      className={className}
      style={{ color, ...style }}
    >
      <defs>
        {/* Fabric texture gradient */}
        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.10)" />
          <stop offset="40%"  stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
        </linearGradient>

        {/* Left sleeve shadow */}
        <linearGradient id="leftSleeveShad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
        </linearGradient>

        {/* Right sleeve shadow */}
        <linearGradient id="rightSleeveShad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.07)" />
        </linearGradient>

        {/* Body side shadows */}
        <linearGradient id="bodySideL" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="rgba(0,0,0,0.06)" />
          <stop offset="30%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="bodySideR" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"  stopColor="rgba(0,0,0,0.06)" />
          <stop offset="30%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>

        {/* Design clip path (print area) */}
        <clipPath id="designClip">
          <rect x="130" y="145" width="140" height="150" rx="4" />
        </clipPath>
      </defs>

      {/* ── Drop shadow ── */}
      <ellipse cx="200" cy="462" rx="118" ry="10" fill="rgba(0,0,0,0.10)" />

      {/* ── Left sleeve ── */}
      <path
        d="M 118 92 L 42 112 L 22 178 L 78 192 L 82 130 Z"
        fill="currentColor"
      />
      <path
        d="M 118 92 L 42 112 L 22 178 L 78 192 L 82 130 Z"
        fill="url(#leftSleeveShad)"
      />
      {/* Sleeve seam */}
      <path d="M 78 192 L 82 130" stroke={seamColor} strokeWidth="1.2" strokeDasharray="3 4" />

      {/* ── Right sleeve ── */}
      <path
        d="M 282 92 L 358 112 L 378 178 L 322 192 L 318 130 Z"
        fill="currentColor"
      />
      <path
        d="M 282 92 L 358 112 L 378 178 L 322 192 L 318 130 Z"
        fill="url(#rightSleeveShad)"
      />
      {/* Sleeve seam */}
      <path d="M 322 192 L 318 130" stroke={seamColor} strokeWidth="1.2" strokeDasharray="3 4" />

      {/* ── Main body ── */}
      <path
        d="M 118 92
           C 128 136 166 158 200 158
           C 234 158 272 136 282 92
           L 318 130 L 322 192 L 318 420
           L 82 420 L 78 192 L 82 130 Z"
        fill="currentColor"
        stroke={seamColor}
        strokeWidth="1.2"
      />

      {/* Body fabric shading */}
      <path
        d="M 118 92 C 128 136 166 158 200 158 C 234 158 272 136 282 92
           L 318 130 L 322 192 L 318 420 L 82 420 L 78 192 L 82 130 Z"
        fill="url(#shirtGrad)"
      />

      {/* Left body edge shadow */}
      <path
        d="M 82 130 L 82 420 L 120 420 L 120 155 Z"
        fill="url(#bodySideL)"
      />
      {/* Right body edge shadow */}
      <path
        d="M 318 130 L 318 420 L 280 420 L 280 155 Z"
        fill="url(#bodySideR)"
      />

      {/* ── Fabric fold lines ── */}
      <path d="M 190 200 Q 196 250 193 310" stroke={foldTint} strokeWidth="1.5" />
      <path d="M 210 200 Q 204 260 207 330" stroke={foldTint} strokeWidth="1.2" />
      <path d="M 170 200 Q 164 270 168 360" stroke={foldTint} strokeWidth="1" />
      <path d="M 230 200 Q 236 280 232 370" stroke={foldTint} strokeWidth="1" />

      {/* ── Shoulder seams ── */}
      <path d="M 82 130 L 118 92"  stroke={seamColor} strokeWidth="1.2" strokeDasharray="3 4" />
      <path d="M 318 130 L 282 92" stroke={seamColor} strokeWidth="1.2" strokeDasharray="3 4" />

      {/* ── Bottom hem ── */}
      <path d="M 82 420 L 318 420" stroke={seamColor} strokeWidth="2" />
      <path d="M 82 415 L 318 415" stroke={seamColor} strokeWidth="0.8" strokeOpacity="0.5" />

      {/* ── Neck collar ── */}
      <path
        d="M 118 92 C 128 136 166 158 200 158 C 234 158 272 136 282 92
           C 270 130 230 152 200 152 C 170 152 130 130 118 92 Z"
        fill={shadowTint}
      />
      {/* Collar rib stitching */}
      <path
        d="M 118 92 C 128 136 166 158 200 158 C 234 158 272 136 282 92"
        fill="none"
        stroke={seamColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Inner collar edge */}
      <path
        d="M 124 94 C 133 132 168 152 200 152 C 232 152 267 132 276 94"
        fill="none"
        stroke={seamColor}
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeOpacity="0.7"
      />

      {/* ── Neck label ── */}
      <rect x="186" y="100" width="28" height="16" rx="2" fill={shadowTint} />
      <path d="M 189 103 L 211 103 M 189 106 L 211 106 M 189 109 L 205 109" stroke={seamColor} strokeWidth="0.8" strokeLinecap="round" />

      {/* ── Design overlay (optional) ── */}
      {designUrl && (
        <image
          href={designUrl}
          x="130" y="145"
          width="140" height="150"
          clipPath="url(#designClip)"
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </svg>
  )
}

/** Returns true if hex color is perceptually dark */
function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  // Perceived luminance (ITU-R BT.709)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128
}
