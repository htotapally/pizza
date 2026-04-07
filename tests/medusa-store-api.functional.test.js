/**
 * Functional tests against a running Medusa backend.
 * Requires `.env` with at least `VITE_API_MEDUSA_PUBLISHABLE_KEY`.
 * Optional: `VITE_MEDUSA_SERVER_URL`, `VITE_MEDUSA_REGION_ID`, `VITE_MEDUSA_SALES_CHANNEL_ID`.
 *
 * Run: npm test
 */
import { describe, it, expect, beforeAll } from 'vitest'
import Medusa from '@medusajs/js-sdk'

const baseUrl = (process.env.VITE_MEDUSA_SERVER_URL || 'http://localhost:9000').replace(/\/$/, '')
const publishableKey = process.env.VITE_API_MEDUSA_PUBLISHABLE_KEY?.trim()
const regionId =
  process.env.VITE_MEDUSA_REGION_ID?.trim() || 'reg_01KN4JM1SKHY8BXNRSRQ4RMDWY'
const salesChannelId = process.env.VITE_MEDUSA_SALES_CHANNEL_ID?.trim()

describe.skipIf(!publishableKey)('Medusa Store API (@medusajs/js-sdk + fetch)', () => {
  let sdk

  beforeAll(() => {
    sdk = new Medusa({
      baseUrl,
      publishableKey,
      auth: {
        type: 'jwt',
        jwtTokenStorageMethod: 'memory',
      },
    })
  })

  it('lists regions (sdk.store.region.list)', async () => {
    const { regions } = await sdk.store.region.list({ limit: 5 })
    expect(Array.isArray(regions)).toBe(true)
  })

  it('lists product categories (sdk.store.category.list)', async () => {
    const { product_categories } = await sdk.store.category.list({
      limit: 10,
      fields: 'id,name,handle',
    })
    expect(Array.isArray(product_categories)).toBe(true)
  })

  it('lists collections (sdk.store.collection.list)', async () => {
    const { collections } = await sdk.store.collection.list({
      limit: 10,
      fields: 'id,title,handle',
    })
    expect(Array.isArray(collections)).toBe(true)
  })

  it('lists products with region_id (sdk.store.product.list)', async () => {
    const { products } = await sdk.store.product.list({
      limit: 3,
      region_id: regionId,
      fields: 'id,title,*variants',
    })
    expect(Array.isArray(products)).toBe(true)
  })

  it('GET /store/store-locations (fetch + x-publishable-api-key)', async () => {
    const params = new URLSearchParams()
    if (salesChannelId) {
      params.set('sales_channel_id', salesChannelId)
    }
    const qs = params.toString()
    const url = `${baseUrl}/store/store-locations${qs ? `?${qs}` : ''}`
    const res = await fetch(url, {
      headers: {
        'x-publishable-api-key': publishableKey,
      },
    })
    expect(res.ok).toBe(true)
    const data = await res.json()
    expect(data).toHaveProperty('store_locations')
    expect(Array.isArray(data.store_locations)).toBe(true)
  })
})
