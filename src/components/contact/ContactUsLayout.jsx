import React from 'react'
import {
  CONTACT_BODY,
  CONTACT_INTRO,
  CONTACT_PHONE_DISPLAY_SITE,
  CONTACT_PHONE_TEL_DIGITS,
  getContactMapEmbedSrc,
  getContactMapOpenUrl,
} from '../../data/contactPage.js'

export default function ContactUsLayout() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[2.5rem]">
          Contact Us
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
          {CONTACT_INTRO}
        </p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
              <div className="relative aspect-[4/3] w-full min-h-[260px]">
                <iframe
                  title="Map — Pizza O Pizza, Frisco"
                  src={getContactMapEmbedSrc()}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm lg:text-left">
              <a
                href={getContactMapOpenUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-red-800 underline-offset-2 hover:underline"
              >
                Open in Google Maps
              </a>
            </p>
          </div>

          <div className="mx-auto w-full max-w-lg text-center lg:mx-0 lg:max-w-none lg:text-left">
            <p className="text-lg text-gray-800 md:text-xl">
              <span className="font-bold">Phone:</span>{' '}
              <a href={`tel:${CONTACT_PHONE_TEL_DIGITS}`} className="font-semibold text-red-800 hover:underline">
                {CONTACT_PHONE_DISPLAY_SITE}
              </a>
            </p>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 lg:mx-0">{CONTACT_BODY}</p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <a
                href={`tel:${CONTACT_PHONE_TEL_DIGITS}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-red-700 px-10 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-red-800"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
