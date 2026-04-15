import React from 'react'
import { Link } from 'react-router-dom'
import AddToCartButton from '../AddToCartButton.jsx'
import { CARD_HOVER_CLASS, formatHomeProductPrice } from './homeShared.js'

export default function HomeFeaturedProducts({ products, productsError }) {
  return (
    <section id="featured" className="scroll-mt-20 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-800">Start your order</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">Shop the menu</p>
          <p className="mt-3 text-lg text-gray-600">Add items from our catalog — prices shown for your region.</p>
        </div>
        {productsError && <p className="text-center text-amber-700">{productsError}</p>}
        {!productsError && products.length === 0 && (
          <p className="text-center text-gray-500">Loading products…</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const variant = product.variants?.[0]
            const price = variant?.calculated_price?.calculated_amount
            const thumb = product.thumbnail || '/images/pizza.png'
            return (
              <article
                key={product.id}
                className={`${CARD_HOVER_CLASS} flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white`}
              >
                <div className="aspect-square bg-gray-50">
                  <img src={thumb} alt={product.title} className="h-full w-full object-contain p-4" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 font-semibold text-gray-900">{product.title}</h3>
                  <p className="mt-2 text-lg font-bold text-red-800">{formatHomeProductPrice(price)}</p>
                  <div className="mt-3">
                    <AddToCartButton variantId={variant?.id} />
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="mt-3 text-sm font-semibold text-red-800 hover:text-red-950"
                  >
                    View details →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
