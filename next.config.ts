import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // Pin the workspace root so Next stops warning about the stray
  // C:\Users\Huawei\package-lock.json and uses this project's directory.
  turbopack: {
    root: path.resolve('.'),
  },
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      // Printful mockups
      {
        protocol: 'https',
        hostname: 'files.cdn.printful.com',
      },
    ],
  },
  // Paquetes nativos que no deben bundlearse (Vercel los incluye como binarios)
  serverExternalPackages: ['@napi-rs/canvas'],
}

export default nextConfig
