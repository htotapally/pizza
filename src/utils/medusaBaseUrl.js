/**
 * Medusa Store API base URL.
 *
 * In local dev, if `.env` still points at Medusa on port 9000, we use
 * `window.location.origin` instead so requests go to the Vite dev server and
 * match the `/store` proxy — avoiding browser CORS to :9000.
 */
export function getMedusaBaseUrl() {
  const raw = import.meta.env.VITE_MEDUSA_SERVER_URL
  const trimmed = typeof raw === 'string' ? raw.replace(/\/$/, '') : ''

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    try {
      const u = trimmed ? new URL(trimmed) : null
      if (
        !trimmed ||
        (u && u.port === '9000' && ['localhost', '127.0.0.1'].includes(u.hostname))
      ) {
        return window.location.origin
      }
    } catch {
      // ignore invalid VITE_MEDUSA_SERVER_URL
    }
  }

  return trimmed || 'http://localhost:9000'
}
