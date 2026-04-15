import React from 'react'

export default function MenuBanner() {
  return (
    <section className="bg-[linear-gradient(180deg,#7f1d1d_0%,#991b1b_50%,#b91c1c_100%)] py-8 text-white md:py-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">Full menu</p>
        <p className="mx-auto mt-2 max-w-lg text-red-100">
          Handcrafted Italian-inspired favorites — pick a category to explore.
        </p>
      </div>
    </section>
  )
}
