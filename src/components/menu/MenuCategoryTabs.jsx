import React from 'react'
import { Link } from 'react-router-dom'

export default function MenuCategoryTabs({ activeSlug, categories }) {
  return (
    <div className="sticky top-[73px] z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <nav
          className="-mx-1 flex gap-1 overflow-x-auto py-3 md:flex-wrap md:justify-center md:overflow-visible"
          aria-label="Menu categories"
        >
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug
            return (
              <Link
                key={cat.slug}
                to={`/menu/${cat.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-red-800 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-900'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
