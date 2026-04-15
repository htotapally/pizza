import React from 'react'
import { Link } from 'react-router-dom'
import { DEAL_CARDS } from '../../data/homeContent.js'
import { CARD_HOVER_CLASS } from './homeShared.js'

export default function HomeDeals() {
  return (
    <section className="border-b border-gray-200 bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {DEAL_CARDS.map((d) => (
            <div
              key={d.id}
              className={`${CARD_HOVER_CLASS} flex flex-col rounded-xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6 text-center`}
            >
              {d.badge && (
                <span className="mx-auto mb-2 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-900">
                  {d.badge}
                </span>
              )}
              {d.price && <p className="text-3xl font-bold text-red-800">{d.price}</p>}
              <h2 className="mt-2 text-lg font-bold text-gray-900">{d.title}</h2>
              <p className="mt-2 flex-1 text-sm text-gray-600">{d.line}</p>
              <Link
                to="/menu/pizza"
                className="mt-4 inline-flex justify-center text-sm font-semibold text-red-800 hover:underline"
              >
                Order now →
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          Prices and offers may vary by location. Start your order to see what&apos;s available near you.
        </p>
      </div>
    </section>
  )
}
