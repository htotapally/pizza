import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { isValidMenuSlug } from '../data/menuContent.js'
import MenuBanner from '../components/menu/MenuBanner.jsx'
import MenuCategoryTabs from '../components/menu/MenuCategoryTabs.jsx'
import MenuPizzaPage from '../components/menu/MenuPizzaPage.jsx'
import MenuCategoryPage from '../components/menu/MenuCategoryPage.jsx'
import MenuDisclaimer from '../components/menu/MenuDisclaimer.jsx'
import { useMenuCategories } from '../components/menu/useMenuCategories.js'

export default function Menu() {
  const { categorySlug } = useParams()
  const { categories, loadError, ready } = useMenuCategories()

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
        <p className="text-sm">Loading menu…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center text-gray-700">
        <p className="font-medium text-red-800">{loadError}</p>
        <p className="mt-2 text-sm text-gray-600">Check that Medusa is running and publishable API key is set.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-red-800 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center text-gray-700">
        <p>No product categories are available yet.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-red-800 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  const defaultSlug = categories[0].slug
  if (!isValidMenuSlug(categorySlug, categories)) {
    return <Navigate to={`/menu/${defaultSlug}`} replace />
  }

  return (
    <div className="text-gray-800">
      <MenuBanner />
      <MenuCategoryTabs activeSlug={categorySlug} categories={categories} />
      {categorySlug === 'pizza' ? (
        <MenuPizzaPage />
      ) : (
        <MenuCategoryPage slug={categorySlug} categories={categories} />
      )}
      <MenuDisclaimer />
    </div>
  )
}
