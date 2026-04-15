import { useEffect, useState } from 'react'
import {
  fetchArtisanPizzas,
  fetchBuildYourOwnPizzas,
  fetchFeaturedDeals,
} from '../../data/menuContent.js'

export function usePizzaMenuExtras() {
  const [featuredDeals, setFeaturedDeals] = useState([])
  const [artisanPizzas, setArtisanPizzas] = useState([])
  const [buildYourOwnPizzas, setBuildYourOwnPizzas] = useState([])
  const [pizzaExtrasLoaded, setPizzaExtrasLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [deals, artisan, byo] = await Promise.all([
          fetchFeaturedDeals(),
          fetchArtisanPizzas(),
          fetchBuildYourOwnPizzas(),
        ])
        if (!cancelled) {
          setFeaturedDeals(deals)
          setArtisanPizzas(artisan)
          setBuildYourOwnPizzas(byo)
        }
      } finally {
        if (!cancelled) setPizzaExtrasLoaded(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { featuredDeals, artisanPizzas, buildYourOwnPizzas, pizzaExtrasLoaded }
}
