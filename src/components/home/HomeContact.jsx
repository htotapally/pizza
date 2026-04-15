import React from 'react'
import { Link } from 'react-router-dom'

export default function HomeContact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Contact</h2>
          <p className="mt-2 text-gray-600">Questions about orders, catering, or a location near you? Reach out.</p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Store</h3>
            <address className="mt-4 space-y-2 not-italic text-gray-600">
              <p>
                Dallas Pizza
                <br />
                Serving the DFW metro area
              </p>
              <p>
                <a href="tel:+19099228023" className="font-medium text-red-800 hover:underline">
                  (909) 922-8023
                </a>
              </p>
            </address>
          </div>
          <div className="rounded-xl bg-red-900 p-8 text-white shadow-md">
            <h3 className="text-lg font-semibold">Quick links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#featured" className="hover:underline">
                  Order now
                </a>
              </li>
              <li>
                <Link to="/menu/pizza" className="hover:underline">
                  Full menu
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:underline">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
