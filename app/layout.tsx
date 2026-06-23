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
    template: '%s | Stampia',
    default: 'Stampia | Playeras personalizadas e impresión DTF Premium en México',
  },
  description: 'Impresión bajo demanda (Print on Demand) en México. Crea playeras, sudaderas, tote bags y más sin pedido mínimo. Envíos rápidos y calidad insuperable.',
  keywords: ['print on demand', 'impresión de playeras', 'playeras personalizadas', 'impresión DTF', 'México', 'tote bags personalizadas', 'sudaderas oversized', 'tazas personalizadas', 'impresión bajo demanda', 'negocio de playeras', 'Stampia'],
  authors: [{ name: 'Stampia', url: BASE }],
  creator: 'Stampia',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: BASE,
    siteName: 'Stampia',
    title: 'Stampia | Impresión Bajo Demanda en México',
    description: 'Impresión de alta calidad desde 1 pieza. Playeras, sudaderas y más.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Stampia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stampia | Tu diseño, impreso.',
    description: 'Taller de impresión bajo demanda en México. Sin mínimo de compra.',
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
