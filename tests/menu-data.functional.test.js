/**
 * Exercises the same modules used by the pizza menu: `menuContent.js` + `storeLocations.js`.
 * Loads credentials via Vitest config + root `.env` (see `vitest.config.js`).
 *
 * Run: npm test
 */
import { describe, it, expect } from 'vitest'
import {
  fetchMenuCategories,
  fetchFeaturedDeals,
  fetchArtisanPizzas,
  fetchBuildYourOwnPizzas,
} from '../src/data/menuContent.js'
import { fetchStoreLocations } from '../src/data/storeLocations.js'

const publishableKey = process.env.VITE_API_MEDUSA_PUBLISHABLE_KEY?.trim()

describe.skipIf(!publishableKey)('Menu data fetchers (src/data)', () => {
  it('fetchMenuCategories returns an array of categories', async () => {
    const rows = await fetchMenuCategories()
    expect(Array.isArray(rows)).toBe(true)
    if (rows.length > 0) {
      expect(rows[0]).toMatchObject({
        id: expect.any(String),
        slug: expect.any(String),
        label: expect.any(String),
      })
    }
  })

  it('fetchFeaturedDeals returns an array', async () => {
    const deals = await fetchFeaturedDeals()
    expect(Array.isArray(deals)).toBe(true)
  })

  it('fetchArtisanPizzas returns an array', async () => {
    const list = await fetchArtisanPizzas()
    expect(Array.isArray(list)).toBe(true)
  })

  it('fetchBuildYourOwnPizzas returns an array', async () => {
    const list = await fetchBuildYourOwnPizzas()
    expect(Array.isArray(list)).toBe(true)
  })

  it('fetchStoreLocations returns locations or error payload', async () => {
    const result = await fetchStoreLocations()
    console.log('fetchStoreLocations result:', result)
    expect(result).toHaveProperty('locations')
    expect(result).toHaveProperty('error')
    expect(Array.isArray(result.locations)).toBe(true)
  })
})
