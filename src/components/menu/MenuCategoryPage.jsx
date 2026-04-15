import React from 'react'
import { categoryItems } from '../../data/menuContent.js'
import MenuOrderButton from './MenuOrderButton.jsx'

export default function MenuCategoryPage({ slug, categories }) {
  const meta = categoryItems[slug]
  const title = categories.find((c) => c.slug === slug)?.label ?? slug

  if (!meta) {
    return (
      <>
        <section className="border-b border-gray-100 bg-white py-10 md:py-14">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              Browse products in this category from our catalog — start your order to see prices and availability.
            </p>
            <div className="mt-8">
              <MenuOrderButton className="px-8 py-3 text-base" />
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="border-b border-gray-100 bg-white py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">{meta.intro}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">
            Start your order to see prices and availability in your area.
          </p>
          <div className="mt-8">
            <MenuOrderButton className="px-8 py-3 text-base" />
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-12">
        <div className="container mx-auto px-4">
          <ul className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {meta.items.map((item) => (
              <li
                key={item.name}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                <div className="mt-6">
                  <MenuOrderButton className="w-full sm:w-auto" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
