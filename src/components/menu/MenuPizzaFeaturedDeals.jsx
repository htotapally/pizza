import React from 'react'
import MenuOrderButton from './MenuOrderButton.jsx'

export default function MenuPizzaFeaturedDeals({ featuredDeals, pizzaExtrasLoaded }) {
  return (
    <section className="bg-[#f8f9fa] py-10">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl">Featured deals</h2>
        {!pizzaExtrasLoaded ? (
          <p className="text-center text-sm text-gray-500">Loading featured deals…</p>
        ) : featuredDeals.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No featured deals in this catalog yet. Add a collection named &quot;Featured Deals&quot; in Medusa and assign
            products.
          </p>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {featuredDeals.map((deal) => (
              <article
                key={deal.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-square bg-gray-50">
                  <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-contain p-4" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {deal.badge && (
                    <span className="mb-2 inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                      {deal.badge}
                    </span>
                  )}
                  <p className="text-2xl font-bold text-red-800">{deal.price}</p>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{deal.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600">{deal.description}</p>
                  <div className="mt-6">
                    <MenuOrderButton className="w-full sm:w-auto" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
