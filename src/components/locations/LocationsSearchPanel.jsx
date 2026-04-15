import React from 'react'

export default function LocationsSearchPanel({
  query,
  onQueryChange,
  geoLoading,
  geoMessage,
  userPos,
  onUseMyLocation,
  onClearUserLocation,
}) {
  return (
    <section className="border-b border-gray-200 bg-white py-10">
      <div className="container mx-auto max-w-2xl px-4">
        <label htmlFor="location-search" className="sr-only">
          Search by city or ZIP code
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="location-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="City or ZIP code"
            autoComplete="postal-code"
            className="min-h-[48px] flex-1 rounded-lg border border-gray-300 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
          />
          <button
            type="button"
            className="min-h-[48px] rounded-lg bg-red-800 px-6 font-semibold text-white shadow transition-colors hover:bg-red-900"
          >
            Search location
          </button>
        </div>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gray-200" aria-hidden />
          <span className="relative bg-white px-4 text-sm font-medium uppercase tracking-wide text-gray-500">or</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onUseMyLocation}
            disabled={geoLoading}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-red-800 bg-white px-8 font-semibold text-red-800 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            {geoLoading ? 'Locating…' : 'Use my current location'}
          </button>
          {geoMessage && <p className="max-w-md text-center text-sm text-gray-600">{geoMessage}</p>}
          {userPos && (
            <button
              type="button"
              onClick={onClearUserLocation}
              className="text-sm text-red-800 underline hover:text-red-900"
            >
              Stop using my location
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
