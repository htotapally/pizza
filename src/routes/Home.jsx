import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddToCartButton from '../components/AddToCartButton.jsx'
import { medusaClient } from '../utils/client.js'

const REGION_ID = 'reg_01KN4JM1SKHY8BXNRSRQ4RMDWY'

const HERO_SLIDES = [
  {
    id: 's1',
    title: 'Large New York style — 6 big slices',
    subtitle: '16″ one-topping pizza made fresh. Order online for pickup or delivery.',
    image: '/images/dallas_pizza.png',
    cta: 'Start order',
    href: '#featured',
  },
  {
    id: 's2',
    title: 'Medium 1-topping — everyday value',
    subtitle: 'Traditional crust. Great for lunch or a quick family night.',
    image: '/images/pizza.png',
    cta: 'View deals',
    href: '/menu/pizza',
  },
  {
    id: 's3',
    title: 'Two-pizza special',
    subtitle: 'Mix and match sizes — see the menu for today’s bundles.',
    image: '/images/4th_of_july_promo.jpg',
    cta: 'See full menu',
    href: '/menu/pizza',
  },
]

const DEAL_CARDS = [
  {
    id: 'd1',
    price: '$16.99',
    title: 'Large 1-topping NY style',
    line: 'Six big slices — classic foldable crust.',
  },
  {
    id: 'd2',
    price: '$8.99',
    title: 'Medium 1-topping',
    line: 'Traditional crust. Online specials — check at checkout.',
  },
  {
    id: 'd3',
    title: 'Two-pizza special',
    line: 'Available in all sizes · 1 topping per pizza',
    badge: 'Bundle',
  },
]

const CATEGORY_TILES = [
  {
    label: 'Pizza',
    sub: 'Hand-tossed & artisan',
    to: '/menu/pizza',
    img: '/images/pizza.png',
  },
  {
    label: 'Rolls',
    sub: 'Stuffed & baked',
    to: '/menu/rolls',
    img: '/images/store_banner_frisco.jpg',
  },
  {
    label: 'Subs',
    sub: 'Oven-toasted',
    to: '/menu/subs',
    img: '/images/store_banner_mckinney.jpg',
  },
  {
    label: 'Deluxe',
    sub: 'Signature pies',
    to: '/menu/pizza',
    img: '/images/dallas_pizza.png',
  },
]

function formatPrice(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100)
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [productsError, setProductsError] = useState(null)
  const [slide, setSlide] = useState(0)
  const [storyOpen, setStoryOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const results = await medusaClient.products.list({
          region_id: REGION_ID,
        })
        if (!cancelled) setProducts(results.products ?? [])
      } catch (e) {
        if (!cancelled) setProductsError(e?.message ?? 'Unable to load products')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setSlide((i) => (i + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  const cardHover =
    'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl shadow-md'

  const current = HERO_SLIDES[slide]

  return (
    <div className="text-gray-800">
      {/* Hero carousel — Vocelli-style full-width promos */}
      <section className="relative overflow-hidden bg-neutral-900">
        <div className="relative min-h-[min(70vh,520px)]">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === slide ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
              aria-hidden={i !== slide}
            >
              <img
                src={s.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
            </div>
          ))}
          <div className="relative z-20 flex min-h-[min(70vh,520px)] items-center">
            <div className="container mx-auto px-4 py-16 md:py-20">
              <div className="max-w-xl text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">Classic Italian quality</p>
                <h1 className="mt-3 text-4xl font-bold leading-tight drop-shadow md:text-5xl lg:text-6xl">
                  {current.title}
                </h1>
                <p className="mt-4 text-lg text-neutral-200 drop-shadow md:text-xl">{current.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {current.href.startsWith('/') ? (
                    <Link
                      to={current.href}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red-700"
                    >
                      {current.cta}
                    </Link>
                  ) : (
                    <a
                      href={current.href}
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red-700"
                    >
                      {current.cta}
                    </a>
                  )}
                  <Link
                    to="/locations"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-white/90 px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Find your store
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={HERO_SLIDES[i].id}
                type="button"
                onClick={() => setSlide(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === slide ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSlide((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 md:block"
            aria-label="Previous slide"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setSlide((i) => (i + 1) % HERO_SLIDES.length)}
            className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 md:block"
            aria-label="Next slide"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Promo strip */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {DEAL_CARDS.map((d) => (
              <div
                key={d.id}
                className={`${cardHover} flex flex-col rounded-xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6 text-center`}
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

      {/* Category tiles — Gelato / Rolls / Subs / Deluxe style */}
      <section className="bg-[#f3f4f6] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {CATEGORY_TILES.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className={`${cardHover} group relative overflow-hidden rounded-2xl bg-white shadow-md`}
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

      {/* Our menu band */}
      <section className="border-y border-gray-200 bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-800">Our menu</h2>
              <p className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">Handcrafted pizza &amp; Italian favorites</p>
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

      {/* Family crafted story */}
      <section id="about" className="scroll-mt-20 bg-[#fafafa] py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Family crafted recipes <span className="text-red-800">since day one</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            When you&apos;re serious about pizza, you learn what it takes to become a neighborhood favorite. It starts
            with fresh, hand-tossed dough every day — and real mozzarella makes all the difference. That bold, classic
            red sauce? Perfection. Fresh ingredients take every pie from good to unforgettable.
          </p>
          {storyOpen && (
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Anyone can put a pizza in the oven, but craftsmanship down to the last crumb is what brings people back.
              At Dallas Pizza, we&apos;re proud to serve the DFW community with the same care we&apos;d serve our own
              family — whether you&apos;re dining in, carrying out, or ordering delivery.
            </p>
          )}
          <button
            type="button"
            onClick={() => setStoryOpen((o) => !o)}
            className="mt-8 text-sm font-bold uppercase tracking-wide text-red-800 hover:text-red-950"
          >
            {storyOpen ? 'Read less' : 'Read more'}
          </button>
        </div>
      </section>

      {/* Rewards / app style dual strip — Vocelli-inspired */}
      <section className="grid md:grid-cols-2">
        <div className="bg-gradient-to-br from-red-900 to-red-950 px-8 py-12 text-center text-white md:py-16">
          <h3 className="text-xl font-bold md:text-2xl">Join our rewards</h3>
          <p className="mt-2 text-red-100">Every bite pays off — ask in-store or online for details.</p>
          <a
            href="#featured"
            className="mt-6 inline-block rounded-lg border-2 border-white/80 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            Start ordering
          </a>
        </div>
        <div className="bg-gradient-to-br from-neutral-800 to-neutral-950 px-8 py-12 text-center text-white md:py-16">
          <h3 className="text-xl font-bold md:text-2xl">Order from anywhere</h3>
          <p className="mt-2 text-neutral-300">Use our website to place your order for pickup or delivery.</p>
          <Link
            to="/menu/pizza"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-red-900 transition-colors hover:bg-gray-100"
          >
            Browse menu
          </Link>
        </div>
      </section>

      {/* Featured products — Medusa catalog */}
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
                  className={`${cardHover} flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white`}
                >
                  <div className="aspect-square bg-gray-50">
                    <img src={thumb} alt={product.title} className="h-full w-full object-contain p-4" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-semibold text-gray-900">{product.title}</h3>
                    <p className="mt-2 text-lg font-bold text-red-800">{formatPrice(price)}</p>
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

      {/* Delivery note */}
      <section id="services" className="scroll-mt-20 border-t border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm leading-relaxed text-gray-600">
            Minimum order may apply for delivery. Delivery areas and charges vary by location. Menu and prices may change
            at any time. Delivery fees are not driver tips.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Contact</h2>
            <p className="mt-2 text-gray-600">Questions about orders, catering, or a location near you? Reach out.</p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Store</h3>
              <address className="mt-4 space-y-2 not-italic text-gray-600">
                <p>
                  Dallas Pizza
                  <br />
                  Serving the DFW metro area
                </p>
                <p>
                  <a href="tel:+19099228023" className="font-medium text-red-800 hover:underline">
                    (909) 922-8023
                  </a>
                </p>
              </address>
            </div>
            <div className="rounded-xl bg-red-900 p-8 text-white shadow-md">
              <h3 className="text-lg font-semibold">Quick links</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href="#featured" className="hover:underline">
                    Order now
                  </a>
                </li>
                <li>
                  <Link to="/menu/pizza" className="hover:underline">
                    Full menu
                  </Link>
                </li>
                <li>
                  <Link to="/locations" className="hover:underline">
                    Locations
                  </Link>
                </li>
                <li>
                  <a href="#about" className="hover:underline">
                    About us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter — red theme */}
      <section className="bg-gradient-to-r from-red-800 to-red-950 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold">Deals in your inbox</h3>
            <p className="mt-2 text-red-100">Get offers, new menu items, and local store news.</p>
            <form
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-red-900 transition-colors hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-red-200/90">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-bold text-white">Dallas Pizza</p>
              <p className="mt-2 text-sm">Premium Italian cuisine</p>
              <p className="mt-4 text-sm leading-relaxed">
                Hand-tossed dough, real mozzarella, and bold sauce — served fresh for dine-in, carryout, and delivery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Order</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#featured" className="hover:text-white">
                    Order now
                  </a>
                </li>
                <li>
                  <Link to="/menu/pizza" className="hover:text-white">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/locations" className="hover:text-white">
                    Locations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <p className="mt-4 text-sm leading-relaxed">
                <a href="tel:+19099228023" className="hover:text-white">
                  (909) 922-8023
                </a>
                <br />
                <a href="mailto:sss.gvrk@gmail.com" className="hover:text-white">
                  sss.gvrk@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-700 pt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Dallas Pizza. All rights reserved. · Minimum delivery required where applicable.
          </div>
        </div>
      </footer>
    </div>
  )
}
