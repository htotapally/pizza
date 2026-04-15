import React from 'react'
import { CONTACT_GALLERY_IMAGES } from '../../data/contactPage.js'

function gallerySrc(src) {
  return src.startsWith('/') ? src : `/${src}`
}

/** Image row matching the gallery strip on pizzaopizza.com contact. */
export default function ContactPhotoStrip() {
  return (
    <section className="border-t border-gray-100 bg-[#f5f5f5] py-10 md:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-3">
          {CONTACT_GALLERY_IMAGES.map((item, i) => (
            <li key={`${item.src}-${i}`} className="aspect-square overflow-hidden bg-gray-200">
              <img
                src={gallerySrc(item.src)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
