import MedusaV2 from '@medusajs/js-sdk'
import { getMedusaBaseUrl } from './medusaBaseUrl.js'

let cachedSdk = null
let cachedKey = ''

export function getMedusaV2Sdk() {
  const baseUrl = getMedusaBaseUrl()
  const publishableKey = import.meta.env.VITE_API_MEDUSA_PUBLISHABLE_KEY
  const cacheKey = `${baseUrl}\0jwt`
  if (!cachedSdk || cachedKey !== cacheKey) {
    cachedSdk = new MedusaV2({
      baseUrl,
      publishableKey,
      auth: {
        type: 'jwt',
        // `local` is browser-only; `memory` works in Node (tests, SSR) with the same publishable key flows.
        jwtTokenStorageMethod: typeof window !== 'undefined' ? 'local' : 'memory',
      },
    })
    cachedKey = cacheKey
  }
  return cachedSdk
}
