import React from 'react'

export default function HomeNewsletter() {
  return (
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
  )
}
