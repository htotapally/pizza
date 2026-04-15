import React, { useState } from 'react'

export default function HomeStory() {
  const [storyOpen, setStoryOpen] = useState(false)

  return (
    <section id="about" className="scroll-mt-20 bg-[#fafafa] py-16">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Family crafted recipes <span className="text-red-800">since day one</span>
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          When you&apos;re serious about pizza, you learn what it takes to become a neighborhood favorite. It starts
          with fresh, hand-tossed dough every day — and real mozzarella makes all the difference. That bold, classic red
          sauce? Perfection. Fresh ingredients take every pie from good to unforgettable.
        </p>
        {storyOpen && (
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Anyone can put a pizza in the oven, but craftsmanship down to the last crumb is what brings people back. At
            Dallas Pizza, we&apos;re proud to serve the DFW community with the same care we&apos;d serve our own family
            — whether you&apos;re dining in, carrying out, or ordering delivery.
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
  )
}
