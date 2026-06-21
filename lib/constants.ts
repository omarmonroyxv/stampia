/**
 * Shared business constants — single source of truth.
 * Import from here instead of hardcoding values in multiple files.
 */

/** Flat shipping rate in MXN */
export const SHIPPING_MXN = 99

/** App base URL (reads env at runtime, falls back to production domain) */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://stampia.shop'
