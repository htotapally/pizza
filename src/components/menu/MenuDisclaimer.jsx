import React from 'react'
import { Link } from 'react-router-dom'

export default function MenuDisclaimer() {
  return (
    <section className="border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto max-w-3xl px-4 text-center text-sm text-gray-600">
        <p>Minimum order and delivery areas may vary. Menu and prices may vary by location and are subject to change.</p>
        <p className="mt-4">
          <Link to="/" className="font-medium text-red-800 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  )
}
