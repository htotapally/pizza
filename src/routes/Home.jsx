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

export default function Home() {
  const { products, productsError } = useHomeProducts()

  return (
    <div className="text-gray-800">
      <HomeHero />
      <HomeDeals />
      <HomeFeaturedProducts products={products} productsError={productsError} />
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
