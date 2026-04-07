import { getMedusaBaseUrl } from '../utils/medusaBaseUrl.js'

/**
 * Fetches stock locations exposed as store finder rows from Medusa `GET /store/store-locations`.
 */
export async function fetchStoreLocations() {
  const base = getMedusaBaseUrl()
  const publishableKey = import.meta.env.VITE_API_MEDUSA_PUBLISHABLE_KEY
  const salesChannelId = import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID?.trim()

  const params = new URLSearchParams()
  if (salesChannelId) {
    params.set('sales_channel_id', salesChannelId)
  }
  const qs = params.toString()
  const url = `${base}/store/store-locations${qs ? `?${qs}` : ''}`

  const res = await fetch(url, {
    headers: {
      'x-publishable-api-key': publishableKey ?? '',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    return {
      locations: [],
      error: text || `Request failed (${res.status})`,
    }
  }

  const data = await res.json()
  return {
    locations: Array.isArray(data.store_locations) ? data.store_locations : [],
    error: null,
  }
}
