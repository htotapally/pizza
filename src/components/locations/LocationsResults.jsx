import React from 'react'
import LocationCard from './LocationCard.jsx'

export default function LocationsResults({
  loadState,
  reloadLocations,
  storeLocations,
  ordered,
  areaLabel,
  onClearQuery,
  userPos,
}) {
  return (
    <section className="bg-[#f8f9fa] py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-2 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Locations in</h2>
            <p className="text-2xl font-bold text-gray-900 capitalize">{areaLabel}</p>
          </div>
          <p className="text-gray-600">
            Number of shops:{' '}
            <span className="font-semibold text-gray-900">{loadState.loading ? '…' : ordered.length}</span>
          </p>
        </div>

        {loadState.loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-600">
            <p className="text-lg font-medium text-gray-800">Loading locations…</p>
          </div>
        )}

        {!loadState.loading && loadState.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-900">
            <p className="font-medium">Could not load store locations.</p>
            <p className="mt-2 text-sm opacity-90">{loadState.error}</p>
            <button
              type="button"
              onClick={reloadLocations}
              className="mt-6 rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900"
            >
              Try again
            </button>
          </div>
        )}

        {!loadState.loading && !loadState.error && ordered.length === 0 && storeLocations.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600">
            <p className="text-lg font-medium text-gray-800">No store locations yet</p>
            <p className="mt-2">
              Add stock locations in Medusa Admin and link them to your sales channel, or clear filters if you use{' '}
              <code className="rounded bg-gray-100 px-1">sales_channel_id</code>.
            </p>
          </div>
        )}

        {!loadState.loading && !loadState.error && ordered.length === 0 && storeLocations.length > 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600">
            <p className="text-lg font-medium text-gray-800">No locations match your search</p>
            <p className="mt-2">Try another city, ZIP, or clear the search to see all stores.</p>
            <button
              type="button"
              onClick={onClearQuery}
              className="mt-6 text-red-800 underline hover:text-red-900"
            >
              Clear search
            </button>
          </div>
        )}

        {!loadState.loading && !loadState.error && ordered.length > 0 && (
          <ul className="grid gap-6 md:grid-cols-2">
            {ordered.map((loc) => (
              <LocationCard key={loc.id} loc={loc} userPos={userPos} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
