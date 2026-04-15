import React from 'react'
import MenuOrderButton from './MenuOrderButton.jsx'

export default function MenuPizzaHero({ intro, orderNote }) {
  return (
    <section className="border-b border-gray-100 bg-white py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Pizza</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">{intro}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">{orderNote}</p>
        <div className="mt-8">
          <MenuOrderButton className="px-8 py-3 text-base" />
        </div>
      </div>
    </section>
  )
}
