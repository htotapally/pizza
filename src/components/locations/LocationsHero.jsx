import React from 'react'

export default function LocationsHero() {
  return (
    <section className="bg-[linear-gradient(180deg,#7f1d1d_0%,#991b1b_45%,#b91c1c_100%)] py-12 text-white md:py-16">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">Store finder</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Find a location</h1>
        <p className="mt-4 text-lg text-red-100">Search by city or ZIP code</p>
      </div>
    </section>
  )
}
