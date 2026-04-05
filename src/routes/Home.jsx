import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddToCartButton from '../components/AddToCartButton.jsx'
import { medusaClient } from '../utils/client.js'

const REGION_ID = 'reg_01KN4JM1SKHY8BXNRSRQ4RMDWY'

const heroGradient =
  'bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_50%,#404040_100%)]'

function formatPrice(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100)
}

function IconLeaf(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.26c.64.18 1.31.26 2 .26 4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26L17 8zM12.04 6.85l1.07-3.11 1.81.62-1.07 3.11-1.81-.62zm-3.48 1.75l.62-1.81 3.11 1.07-.62 1.81-3.11-1.07z" />
    </svg>
  )
}
function IconTruck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  )
}
function IconHeart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={props.className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

const categoryIcons = [
  { name: 'Vegetables', sub: 'Fresh & Organic', icon: '🥕', color: 'text-orange-500' },
  { name: 'Fruits', sub: 'Seasonal & Sweet', icon: '🍎', color: 'text-red-500' },
  { name: 'Spices', sub: 'Authentic & Aromatic', icon: '🌿', color: 'text-green-600' },
  { name: 'Grains', sub: 'Premium Quality', icon: '🌾', color: 'text-yellow-500' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [productsError, setProductsError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const results = await medusaClient.products.list({
          region_id: REGION_ID
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

  const cardHover =
    'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl shadow-md'

  return (
    <div className="text-gray-800">
      <section className={`${heroGradient} py-20 text-white`}>
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <img
              src="/images/pizza.png"
              alt="IBB Fresh Logo"
              className="mx-auto mb-8 h-24 w-auto rounded-lg object-cover"
            />
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">Welcome to IBB Express</h1>
            <p className="mb-8 text-xl text-gray-200 md:text-2xl">
              Your Premium Destination for Fresh Indian Groceries
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
              From farm-fresh vegetables to authentic spices, we bring you the finest quality Indian groceries
              delivered right to your doorstep in Rancho Cucamonga, CA.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#featured"
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-red-700"
              >
                Shop Now
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-gray-800"
              >
                Quick Order
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Why Choose IBB Fresh?</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We&apos;re committed to providing the freshest, highest-quality Indian groceries with exceptional
              service.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Fresh & Quality',
                body: 'We source only the freshest vegetables, fruits, and groceries to ensure the best quality for your family.',
                Icon: IconLeaf,
              },
              {
                title: 'Fast Delivery',
                body: 'Quick and reliable delivery service to your doorstep in Rancho Cucamonga and surrounding areas.',
                Icon: IconTruck,
              },
              {
                title: 'Customer Care',
                body: 'Dedicated customer service with easy order tracking and support for all your grocery needs.',
                Icon: IconHeart,
              },
            ].map((feature) => {
              const IconComponent = feature.Icon
              return (
                <div
                  key={feature.title}
                  className={`${cardHover} rounded-lg bg-white p-8 text-center shadow-md`}
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <IconComponent className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-20 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Our Product Categories</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Explore our extensive range of authentic Indian groceries and fresh produce.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categoryIcons.map((cat) => (
              <div
                key={cat.name}
                className={`${cardHover} rounded-lg bg-white p-6 text-center shadow-md`}
              >
                <div className={`mb-3 text-3xl ${cat.color}`} aria-hidden>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="#featured"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-red-700"
            >
              Browse All Products
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Our Services</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Convenient shopping and delivery options to meet your needs.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-red-50 p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Home Delivery</h3>
              <p className="mb-4 text-gray-600">
                Get your groceries delivered fresh to your doorstep. Fast, reliable, and convenient delivery
                service.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Same-day delivery available</li>
                <li>• Contactless delivery option</li>
                <li>• Real-time order tracking</li>
              </ul>
            </div>
            <div className="rounded-lg bg-gray-100 p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Store Pickup</h3>
              <p className="mb-4 text-gray-600">
                Prefer to pick up your order? Visit our store location for quick and easy pickup service.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Order ahead and pickup</li>
                <li>• Fresh products guaranteed</li>
                <li>• Friendly staff assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-20 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl">About IBB Fresh</h2>
            <p className="mb-8 text-lg text-gray-600">
              IBB Fresh is your trusted local Indian grocery store, serving the Rancho Cucamonga community with fresh,
              authentic, and high-quality products. We understand the importance of traditional ingredients in Indian
              cooking and are committed to providing you with the best selection.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { value: '1200+', label: 'Products Available' },
                { value: '24/7', label: 'Online Ordering' },
                { value: '100%', label: 'Fresh Guarantee' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-2 text-3xl font-bold text-red-600">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Featured Products</h2>
            <p className="text-lg text-gray-600">A selection from our catalog</p>
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
                  className={`${cardHover} flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white`}
                >
                  <div className="aspect-square bg-gray-100">
                    <img src={thumb} alt={product.title} className="h-full w-full object-contain p-4" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-semibold text-gray-900">{product.title}</h3>
                    <p className="mt-2 text-lg font-bold text-red-600">{formatPrice(price)}</p>
                    <div className="mt-3">
                      <AddToCartButton variantId={variant?.id} />
                    </div>
                    <Link
                      to={`/products/${product.id}`}
                      className="mt-3 text-sm font-semibold text-red-700 hover:text-red-900"
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

      <section id="contact" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">Get In Touch</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Have questions or need assistance? We&apos;re here to help!
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Store Information</h3>
              <address className="space-y-3 not-italic text-gray-600">
                <p>
                  12730 Foothill Blvd Suite 102
                  <br />
                  Rancho Cucamonga, CA 91739
                </p>
                <p>
                  <a href="tel:+19099228023" className="text-red-600 hover:underline">
                    (909) 922-8023
                  </a>
                </p>
                <p>Mon–Sun: 9:00 AM – 9:00 PM</p>
              </address>
            </div>
            <div className="rounded-lg bg-gray-800 p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-white">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="#featured"
                  className="block rounded-lg bg-red-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-red-700"
                >
                  Shop Now
                </a>
                <a
                  href="#contact"
                  className="block rounded-lg bg-white px-4 py-3 text-center font-medium text-gray-800 transition-colors hover:bg-gray-100"
                >
                  Quick Order
                </a>
                <button
                  type="button"
                  className="w-full rounded-lg bg-gray-700 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-gray-600"
                >
                  Track Your Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-2 text-2xl font-bold">Stay Updated on Deals &amp; Offers!</h3>
            <p className="mb-6 text-emerald-50">
              Subscribe to our newsletter for fresh deals, discounts, and new arrivals.
            </p>
            <form
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
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
                className="rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-emerald-100">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-bold text-white">IBB Fresh</p>
              <p className="mt-2 text-sm">Premium Indian Groceries</p>
              <p className="mt-4 text-sm leading-relaxed">
                Your trusted source for fresh, authentic Indian groceries in Rancho Cucamonga, CA.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#featured" className="hover:text-white">
                    Order Now
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Services</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Home Delivery</li>
                <li>Store Pickup</li>
                <li>Fresh Produce</li>
                <li>Authentic Spices</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <p className="mt-4 text-sm leading-relaxed">
                12730 Foothill Blvd Suite 102
                <br />
                Rancho Cucamonga, CA 91739
                <br />
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
            © {new Date().getFullYear()} SSS GVRK Enterprise LLC. All rights reserved. | Premium Indian Grocery Store
          </div>
        </div>
      </footer>
    </div>
  )
}
