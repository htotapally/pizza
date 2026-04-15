import { useEffect, useState } from 'react'
import { fetchMenuCategories } from '../../data/menuContent.js'

export function useMenuCategories() {
  const [categories, setCategories] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const list = await fetchMenuCategories()
        if (!cancelled) {
          setCategories(list)
          setLoadError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message ?? 'Could not load menu categories')
          setCategories([])
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { categories, loadError, ready }
}
