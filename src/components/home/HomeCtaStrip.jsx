import React from 'react'
import { Link } from 'react-router-dom'

export default function HomeCtaStrip() {
  return (
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
  )
}
