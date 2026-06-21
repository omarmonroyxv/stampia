export function VisaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 24" fill="none" className={className} style={{ width: 38, height: 24 }}>
      <rect width="38" height="24" rx="3" fill="#1434CB" />
      <path d="M14.6 15.8l-1.3-8.2h-2l-2.1 6.5-1-6.5h-2.1l1.6 8.2h2l2.1-6.4 1 6.4h1.8zm3.2-8.2h-1.8v8.2h1.8v-8.2zm6.2 3.8c0-1.8-2.6-1.9-2.6-2.7 0-.3.3-.6.8-.7h1.8v-1.6c-.3-.1-1-.2-1.9-.2-2 0-3.3 1-3.3 2.5 0 1.9 2.7 2 2.7 2.8 0 .4-.4.6-.8.6h-2.1v1.6c.4.1 1.2.2 2 .2 2 0 3.4-1 3.4-2.5zm5.7-3.8l-1.5 6.2-1.6-6.2h-2.3l2.4 8.2h2l2.3-8.2h-1.3z" fill="#fff" />
    </svg>
  )
}

export function MastercardLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 24" fill="none" className={className} style={{ width: 38, height: 24 }}>
      <rect width="38" height="24" rx="3" fill="#141823" />
      <circle cx="15" cy="12" r="6" fill="#EB001B" />
      <circle cx="23" cy="12" r="6" fill="#F79E1B" />
      <path d="M19 16.5c-1.5-1-2.5-2.6-2.5-4.5s1-3.5 2.5-4.5c1.5 1 2.5 2.6 2.5 4.5s-1 3.5-2.5 4.5z" fill="#FF5F00" />
    </svg>
  )
}

export function AmexLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 24" fill="none" className={className} style={{ width: 38, height: 24 }}>
      <rect width="38" height="24" rx="3" fill="#006FCF" />
      <text x="19" y="16" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">AMEX</text>
    </svg>
  )
}

export function OxxoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 24" fill="none" className={className} style={{ width: 38, height: 24 }}>
      <rect width="38" height="24" rx="3" fill="#E21B22" />
      <rect x="2" y="2" width="34" height="20" rx="2" fill="#E21B22" stroke="#FFC107" strokeWidth="1" />
      <text x="19" y="16" fill="#FFC107" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">OXXO</text>
    </svg>
  )
}

export function SpeiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 24" fill="none" className={className} style={{ width: 38, height: 24 }}>
      <rect width="38" height="24" rx="3" fill="#000" />
      <text x="19" y="16" fill="#10B981" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">SPEI</text>
    </svg>
  )
}
