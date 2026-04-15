import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../../data/homeContent.js'

export default function HomeHero() {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setSlide((i) => (i + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(t)
  }, [])

  const current = HERO_SLIDES[slide]

  return (
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
            <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          </div>
        ))}
        <div className="relative z-20 flex min-h-[min(70vh,520px)] items-center">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                Classic Italian quality
              </p>
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
  )
}
