import React from 'react'
import { Link } from 'react-router-dom'

export default function HomeMenuBand() {
  return (
    <section className="border-y border-gray-200 bg-white py-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-800">Our menu</h2>
            <p className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Handcrafted pizza &amp; Italian favorites
            </p>
            <p className="mt-4 text-gray-600">
              From build-your-own pies to artisan recipes, subs, pasta, and more — everything is made with fresh
              ingredients and dough prepared in-house.
            </p>
            <Link
              to="/menu/pizza"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-red-800 px-10 py-3.5 text-lg font-bold text-white transition-colors hover:bg-red-900"
            >
              View full menu
            </Link>
          </div>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
            <img src="/images/dallas_pizza.png" alt="Featured pizza" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
