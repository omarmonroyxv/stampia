import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout', '/cart', '/customize/'],
    },
    sitemap: 'https://stampia.shop/sitemap.xml',
  }
}
