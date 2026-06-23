import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces, Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const archivo = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const publicSans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-public',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '700'],
})

const BASE = 'https://stampia.shop'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Stampia — Tu diseño, impreso',
    template: '%s | Stampia',
  },
  description: 'Taller de impresion bajo demanda en Mexico. Sube tu diseno, elige tu prenda y recibela en casa. Sin pedido minimo, desde una sola pieza. DTG premium.',
  keywords: [
    'impresion bajo demanda Mexico',
    'playeras personalizadas',
    'print on demand Mexico',
    'impresion DTG',
    'ropa personalizada',
    'merch personalizado',
    'stampia',
    'hoodies oversized personalizadas',
    'tote bags impresas',
    'placas acrílicas personalizadas',
    'impresión digital textil',
    'print on demand',
  ],
  authors: [{ name: 'Stampia', url: BASE }],
  creator: 'Stampia',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: BASE,
    siteName: 'Stampia',
    title: 'Stampia — Tu diseno, impreso',
    description: 'Impresion bajo demanda en Mexico. Sin pedido minimo, desde una sola pieza.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Stampia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stampia — Tu diseno, impreso',
    description: 'Impresion bajo demanda en Mexico. Sin pedido minimo, desde una sola pieza.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: BASE,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${fraunces.variable} ${archivo.variable} ${publicSans.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
