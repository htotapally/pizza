import { useCallback, useEffect, useState } from 'react'
import { fetchStoreLocations } from '../../data/storeLocations.js'

export function useStoreLocations() {
  const [storeLocations, setStoreLocations] = useState([])
  const [loadState, setLoadState] = useState({ loading: true, error: null })

  const reloadLocations = useCallback(() => {
    setLoadState({ loading: true, error: null })
    fetchStoreLocations().then(({ locations, error }) => {
      if (error) {
        setStoreLocations([])
        setLoadState({ loading: false, error })
        return
      }
      setStoreLocations(locations)
      setLoadState({ loading: false, error: null })
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchStoreLocations().then(({ locations, error }) => {
      if (cancelled) return
      if (error) {
        setStoreLocations([])
        setLoadState({ loading: false, error })
        return
      }
      setStoreLocations(locations)
      setLoadState({ loading: false, error: null })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { storeLocations, loadState, reloadLocations }
}
