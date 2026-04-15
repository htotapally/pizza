import React from 'react'
import { Link } from 'react-router-dom'

export default function LocationsDisclaimer() {
  return (
    <section className="border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto max-w-3xl px-4 text-center text-sm text-gray-600">
        <p>
          Minimum order and delivery areas may vary by location. Menu and prices are subject to change. Delivery fees
          are not tips for drivers.
        </p>
        <p className="mt-4">
          <Link to="/" className="font-medium text-red-800 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  )
}
