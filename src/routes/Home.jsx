import React from 'react'
import HomeHero from '../components/home/HomeHero.jsx'
import HomeDeals from '../components/home/HomeDeals.jsx'
import HomeCategories from '../components/home/HomeCategories.jsx'
import HomeMenuBand from '../components/home/HomeMenuBand.jsx'
import HomeStory from '../components/home/HomeStory.jsx'
import HomeCtaStrip from '../components/home/HomeCtaStrip.jsx'
import HomeFeaturedProducts from '../components/home/HomeFeaturedProducts.jsx'
import HomeDeliveryNote from '../components/home/HomeDeliveryNote.jsx'
import HomeContact from '../components/home/HomeContact.jsx'
import HomeNewsletter from '../components/home/HomeNewsletter.jsx'
import { useHomeProducts } from '../components/home/useHomeProducts.js'

import MenuPizzaFeaturedDeals from '../components/menu/MenuPizzaFeaturedDeals.jsx'
import { usePizzaMenuExtras } from '../components/menu/usePizzaMenuExtras.js'

export default function Home() {
  const { products, productsError } = useHomeProducts()
  const { featuredDeals, pizzaExtrasLoaded } = usePizzaMenuExtras()

  const showHomeDealsStrip = products.length > 3
  const featuredCatalogProducts = showHomeDealsStrip ? products.slice(3) : products

  return (
    <div className="text-gray-800">
      <HomeHero />
      {showHomeDealsStrip && (
        <HomeDeals products={products.slice(0, 3)} productsError={productsError} />
      )}
      <MenuPizzaFeaturedDeals featuredDeals={featuredDeals} pizzaExtrasLoaded={pizzaExtrasLoaded} />
      <HomeFeaturedProducts products={featuredCatalogProducts} productsError={productsError} />
      <HomeMenuBand />
      <HomeStory />
      <HomeCtaStrip />
      <HomeDeliveryNote />
      <HomeCategories />
      <HomeContact />
      <HomeNewsletter />
    </div>
  )
}
