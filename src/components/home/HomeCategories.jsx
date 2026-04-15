import React from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_TILES } from '../../data/homeContent.js'
import { CARD_HOVER_CLASS } from './homeShared.js'

export default function HomeCategories() {
  return (
    <section className="bg-[#f3f4f6] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CATEGORY_TILES.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className={`${CARD_HOVER_CLASS} group relative overflow-hidden rounded-2xl bg-white shadow-md`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                  src={c.img}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-gray-900">{c.label}</h3>
                <p className="text-sm text-gray-600">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <p className="text-center text-lg font-medium text-gray-700">See full menu and get local deals</p>
          <Link
            to="/locations"
            className="inline-flex min-w-[200px] items-center justify-center rounded-lg bg-red-800 px-8 py-3 font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-red-900"
          >
            Find your store
          </Link>
        </div>
      </div>
    </section>
  )
}
