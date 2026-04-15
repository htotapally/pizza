import React from 'react'
import MenuOrderButton from './MenuOrderButton.jsx'

export default function MenuPizzaBuildYourOwn({
  buildYourOwnPizzas,
  pizzaExtrasLoaded,
  buildYourOwn,
}) {
  return (
    <section className="border-y border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{buildYourOwn.title}</h2>
          {!pizzaExtrasLoaded ? (
            <p className="mt-4 text-sm text-gray-500">Loading options…</p>
          ) : buildYourOwnPizzas.length === 0 ? (
            <>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 leading-relaxed">{buildYourOwn.bodyFallback}</p>
              <p className="mx-auto mt-3 max-w-xl text-xs text-gray-500">{buildYourOwn.footnote}</p>
            </>
          ) : (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600">{buildYourOwn.footnote}</p>
          )}
        </div>
        {pizzaExtrasLoaded && buildYourOwnPizzas.length > 0 && (
          <ul className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {buildYourOwnPizzas.map((p) => (
              <li
                key={p.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-square bg-gray-50">
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain p-4" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <p className="mt-2 text-xl font-bold text-red-800">{p.priceLabel}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{p.description}</p>
                  <div className="mt-6">
                    <MenuOrderButton className="w-full sm:w-auto" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
