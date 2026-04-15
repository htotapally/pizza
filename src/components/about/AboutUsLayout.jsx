import React from 'react'
import { Link } from 'react-router-dom'
import { ABOUT_HERO_IMAGE, ABOUT_INTRO, ABOUT_PARAGRAPHS } from '../../data/aboutPage.js'

function heroSrc(src) {
  return src.startsWith('/') ? src : `/${src}`
}

export default function AboutUsLayout() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[2.5rem]">
          About Us
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
          {ABOUT_INTRO}
        </p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
              <div className="relative aspect-[4/3] w-full min-h-[260px]">
                <img
                  src={heroSrc(ABOUT_HERO_IMAGE)}
                  alt="Pizza O Pizza — our kitchen and team"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:max-w-none lg:text-left">
            {ABOUT_PARAGRAPHS.map((text, i) => (
              <p key={i} className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 first:mt-0 lg:mx-0">
                {text}
              </p>
            ))}
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                to="/menu/pizza"
                className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-red-700 px-10 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-red-800"
              >
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
