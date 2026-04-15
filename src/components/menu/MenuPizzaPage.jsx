import React from 'react'
import { pizzaMenu } from '../../data/menuContent.js'
import { usePizzaMenuExtras } from './usePizzaMenuExtras.js'
import MenuPizzaHero from './MenuPizzaHero.jsx'
import MenuPizzaFeaturedDeals from './MenuPizzaFeaturedDeals.jsx'
import MenuPizzaBuildYourOwn from './MenuPizzaBuildYourOwn.jsx'
import MenuPizzaArtisan from './MenuPizzaArtisan.jsx'

export default function MenuPizzaPage() {
  const m = pizzaMenu
  const { featuredDeals, artisanPizzas, buildYourOwnPizzas, pizzaExtrasLoaded } = usePizzaMenuExtras()

  return (
    <>
      <MenuPizzaHero intro={m.intro} orderNote={m.orderNote} />
      <MenuPizzaFeaturedDeals featuredDeals={featuredDeals} pizzaExtrasLoaded={pizzaExtrasLoaded} />
      <MenuPizzaBuildYourOwn
        buildYourOwnPizzas={buildYourOwnPizzas}
        pizzaExtrasLoaded={pizzaExtrasLoaded}
        buildYourOwn={m.buildYourOwn}
      />
      <MenuPizzaArtisan
        artisanPizzas={artisanPizzas}
        pizzaExtrasLoaded={pizzaExtrasLoaded}
        artisanIntro={m.artisanIntro}
      />
    </>
  )
}
