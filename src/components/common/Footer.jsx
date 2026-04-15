import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-block">
              <img
                src="/images/pizza/foodex_logo-1-removebg-preview.png"
                alt="Pizza O Pizza"
                className="h-16 w-auto max-w-[220px] object-contain object-left"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Discover culinary delights recipes and inspiration in our delightful food haven.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-400">
              <li>25691 Smotherman rd, STE 180, Frisco, TX 75033</li>
              <li>
                <a href="tel:+12148307642" className="text-white hover:underline">
                  +1 (214) 830-7642
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">Quick Link</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/menu/pizza" className="text-gray-400 transition-colors hover:text-white">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-gray-400 transition-colors hover:text-white">
                  Locations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 transition-colors hover:text-white">
                  contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white">Opening time</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>
                <span className="font-semibold text-gray-300">Monday - Thursday:</span> 10:30 AM - 10:30 PM
              </li>
              <li>
                <span className="font-semibold text-gray-300">Friday - Saturday:</span> 10:30 AM - 11:00 PM
              </li>
              <li>
                <span className="font-semibold text-gray-300">Sunday:</span> 10:30 AM - 10:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-8 text-center text-xs text-gray-500">
          © {year} All rights reserved. Powered By GROZiiT
        </div>
      </div>
    </footer>
  )
}
