import { useEffect, useState } from 'react'
import { medusaClient } from '../../utils/client.js'

const REGION_ID = import.meta.env.VITE_MEDUSA_DEFAULT_REGION_ID?.trim()

export function useHomeProducts() {
  const [products, setProducts] = useState([])
  const [productsError, setProductsError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const results = await medusaClient.products.list({
          region_id: REGION_ID,
        })
        if (!cancelled) setProducts(results.products ?? [])
      } catch (e) {
        if (!cancelled) setProductsError(e?.message ?? 'Unable to load products')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { products, productsError }
}
