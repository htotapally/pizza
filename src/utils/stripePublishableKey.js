import { getMedusaBaseUrl } from './medusaBaseUrl.js'

/**
 * Resolve Stripe publishable key: Vite env, or Medusa `/store/stripe-publishable-key`
 * when `STRIPE_PUBLISHABLE_KEY` is set on the server (pairs with `STRIPE_API_KEY`).
 */
export async function resolveStripePublishableKey() {
  const fromVite = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
  if (fromVite) return fromVite

  const base = getMedusaBaseUrl()
  const medusaPk = import.meta.env.VITE_API_MEDUSA_PUBLISHABLE_KEY?.trim()
  const headers = {}
  if (medusaPk) {
    headers['x-publishable-api-key'] = medusaPk
  }

  const res = await fetch(`${base}/store/stripe-publishable-key`, { headers })
  if (!res.ok) {
    throw new Error(`Could not load Stripe publishable key (${res.status})`)
  }
  const data = await res.json()
  const key = typeof data?.publishable_key === 'string' ? data.publishable_key.trim() : ''
  return key || ''
}
