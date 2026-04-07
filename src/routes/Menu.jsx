import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  fetchMenuCategories,
  fetchArtisanPizzas,
  fetchBuildYourOwnPizzas,
  fetchFeaturedDeals,
  pizzaMenu,
  categoryItems,
  isValidMenuSlug,
} from '../data/menuContent.js'

function OrderButton({ className = '' }) {
  return (
    <a
      href="/#featured"
      className={`inline-flex items-center justify-center rounded-lg bg-red-800 px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-red-900 ${className}`}
    >
      Order now
    </a>
  )
}

function CategoryTabs({ activeSlug, categories }) {
  return (
    <div className="sticky top-[73px] z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <nav
          className="-mx-1 flex gap-1 overflow-x-auto py-3 md:flex-wrap md:justify-center md:overflow-visible"
          aria-label="Menu categories"
        >
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug
            return (
              <Link
                key={cat.slug}
                to={`/menu/${cat.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-red-800 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-900'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

function PizzaPage() {
  const m = pizzaMenu
  const [featuredDeals, setFeaturedDeals] = useState([])
  const [artisanPizzas, setArtisanPizzas] = useState([])
  const [buildYourOwnPizzas, setBuildYourOwnPizzas] = useState([])
  const [pizzaExtrasLoaded, setPizzaExtrasLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [deals, artisan, byo] = await Promise.all([
          fetchFeaturedDeals(),
          fetchArtisanPizzas(),
          fetchBuildYourOwnPizzas(),
        ])
        if (!cancelled) {
          setFeaturedDeals(deals)
          setArtisanPizzas(artisan)
          setBuildYourOwnPizzas(byo)
        }
      } finally {
        if (!cancelled) setPizzaExtrasLoaded(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <section className="border-b border-gray-100 bg-white py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Pizza</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">{m.intro}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">{m.orderNote}</p>
          <div className="mt-8">
            <OrderButton className="px-8 py-3 text-base" />
          </div>
        </div>
      </section>

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
                    <img
                      src={deal.imageUrl}
                      alt={deal.title}
                      className="h-full w-full object-contain p-4"
                    />
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
                      <OrderButton className="w-full sm:w-auto" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{m.buildYourOwn.title}</h2>
            {!pizzaExtrasLoaded ? (
              <p className="mt-4 text-sm text-gray-500">Loading options…</p>
            ) : buildYourOwnPizzas.length === 0 ? (
              <>
                <p className="mx-auto mt-4 max-w-2xl text-gray-600 leading-relaxed">{m.buildYourOwn.bodyFallback}</p>
                <p className="mx-auto mt-3 max-w-xl text-xs text-gray-500">{m.buildYourOwn.footnote}</p>
              </>
            ) : (
              <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600">{m.buildYourOwn.footnote}</p>
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
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="mt-2 text-xl font-bold text-red-800">{p.priceLabel}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{p.description}</p>
                    <div className="mt-6">
                      <OrderButton className="w-full sm:w-auto" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Artisan pizza</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{m.artisanIntro}</p>
          </div>
          {!pizzaExtrasLoaded ? (
            <p className="text-center text-sm text-gray-500">Loading artisan pizzas…</p>
          ) : artisanPizzas.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No artisan pizzas in this catalog yet. Add products to the Pizza category and the &quot;Artisan Pizza&quot;
              collection in Medusa.
            </p>
          ) : (
            <ul className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artisanPizzas.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-square bg-gray-50">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold capitalize text-gray-900">{p.name}</h3>
                    <p className="mt-2 text-xl font-bold text-red-800">{p.priceLabel}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{p.description}</p>
                    <div className="mt-6">
                      <OrderButton className="w-full sm:w-auto" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

function GenericCategoryPage({ slug, categories }) {
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
              <OrderButton className="px-8 py-3 text-base" />
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
            <OrderButton className="px-8 py-3 text-base" />
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
                  <OrderButton className="w-full sm:w-auto" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default function Menu() {
  const { categorySlug } = useParams()
  const [categories, setCategories] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const list = await fetchMenuCategories()
        if (!cancelled) {
          setCategories(list)
          setLoadError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e?.message ?? 'Could not load menu categories')
          setCategories([])
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
        <p className="text-sm">Loading menu…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center text-gray-700">
        <p className="font-medium text-red-800">{loadError}</p>
        <p className="mt-2 text-sm text-gray-600">Check that Medusa is running and publishable API key is set.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-red-800 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center text-gray-700">
        <p>No product categories are available yet.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-red-800 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  const defaultSlug = categories[0].slug
  if (!isValidMenuSlug(categorySlug, categories)) {
    return <Navigate to={`/menu/${defaultSlug}`} replace />
  }

  return (
    <div className="text-gray-800">
      <section className="bg-[linear-gradient(180deg,#7f1d1d_0%,#991b1b_50%,#b91c1c_100%)] py-8 text-white md:py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">Full menu</p>
          <p className="mx-auto mt-2 max-w-lg text-red-100">
            Handcrafted Italian-inspired favorites — pick a category to explore.
          </p>
        </div>
      </section>

      <CategoryTabs activeSlug={categorySlug} categories={categories} />

      {categorySlug === 'pizza' ? <PizzaPage /> : <GenericCategoryPage slug={categorySlug} categories={categories} />}

      <section className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto max-w-3xl px-4 text-center text-sm text-gray-600">
          <p>
            Minimum order and delivery areas may vary. Menu and prices may vary by location and are subject to change.
          </p>
          <p className="mt-4">
            <Link to="/" className="font-medium text-red-800 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
