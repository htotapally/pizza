import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStoreLocations } from '../data/storeLocations.js'

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function formatLineAddress(loc) {
  return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`
}

function matchesQuery(loc, q) {
  const s = q.trim().toLowerCase()
  if (!s) return true
  const blob = [loc.name, loc.address, loc.city, loc.state, loc.zip, loc.phone].join(' ').toLowerCase()
  return blob.includes(s)
}

function hasCoords(loc) {
  return (
    typeof loc.lat === 'number' &&
    typeof loc.lng === 'number' &&
    !Number.isNaN(loc.lat) &&
    !Number.isNaN(loc.lng)
  )
}

export default function Locations() {
  const [storeLocations, setStoreLocations] = useState([])
  const [loadState, setLoadState] = useState({ loading: true, error: null })

  const [query, setQuery] = useState('')
  const [userPos, setUserPos] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoMessage, setGeoMessage] = useState(null)

  const reloadLocations = useCallback(() => {
    setLoadState({ loading: true, error: null })
    fetchStoreLocations().then(({ locations, error }) => {
      if (error) {
        setStoreLocations([])
        setLoadState({ loading: false, error })
        return
      }
      setStoreLocations(locations)
      setLoadState({ loading: false, error: null })
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchStoreLocations().then(({ locations, error }) => {
      if (cancelled) return
      if (error) {
        setStoreLocations([])
        setLoadState({ loading: false, error })
        return
      }
      setStoreLocations(locations)
      setLoadState({ loading: false, error: null })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () => storeLocations.filter((loc) => matchesQuery(loc, query)),
    [storeLocations, query]
  )

  const ordered = useMemo(() => {
    if (!userPos) {
      return [...filtered].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name))
    }
    return [...filtered]
      .map((loc) => {
        if (hasCoords(loc)) {
          return {
            ...loc,
            distanceMi: haversineMiles(userPos.lat, userPos.lng, loc.lat, loc.lng),
          }
        }
        return { ...loc, distanceMi: undefined }
      })
      .sort((a, b) => {
        if (a.distanceMi != null && b.distanceMi != null) {
          return a.distanceMi - b.distanceMi
        }
        if (a.distanceMi != null) return -1
        if (b.distanceMi != null) return 1
        return a.city.localeCompare(b.city) || a.name.localeCompare(b.name)
      })
  }, [filtered, userPos])

  const useMyLocation = () => {
    setGeoMessage(null)
    if (!navigator.geolocation) {
      setGeoMessage('Location is not supported in this browser.')
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoLoading(false)
        setGeoMessage('Showing stores nearest to you.')
      },
      () => {
        setGeoLoading(false)
        setGeoMessage('Unable to read your location. You can still search by city or ZIP.')
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    )
  }

  const areaLabel =
    query.trim() ||
    (userPos ? 'Near you' : 'All locations')

  return (
    <div className="text-gray-800">
      <section className="bg-[linear-gradient(180deg,#7f1d1d_0%,#991b1b_45%,#b91c1c_100%)] py-12 text-white md:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-100">Store finder</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Find a location</h1>
          <p className="mt-4 text-lg text-red-100">Search by city or ZIP code</p>
        </div>
      </section>

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
              onChange={(e) => setQuery(e.target.value)}
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
            <span className="relative bg-white px-4 text-sm font-medium uppercase tracking-wide text-gray-500">
              or
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={useMyLocation}
              disabled={geoLoading}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-red-800 bg-white px-8 font-semibold text-red-800 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {geoLoading ? 'Locating…' : 'Use my current location'}
            </button>
            {geoMessage && <p className="max-w-md text-center text-sm text-gray-600">{geoMessage}</p>}
            {userPos && (
              <button
                type="button"
                onClick={() => {
                  setUserPos(null)
                  setGeoMessage(null)
                }}
                className="text-sm text-red-800 underline hover:text-red-900"
              >
                Stop using my location
              </button>
            )}
          </div>
        </div>
      </section>

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
                onClick={() => setQuery('')}
                className="mt-6 text-red-800 underline hover:text-red-900"
              >
                Clear search
              </button>
            </div>
          )}

          {!loadState.loading && !loadState.error && ordered.length > 0 && (
            <ul className="grid gap-6 md:grid-cols-2">
              {ordered.map((loc) => {
                const line = formatLineAddress(loc)
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(line)}`
                const phoneDigits = loc.phone ? String(loc.phone).replace(/\D/g, '') : ''
                return (
                  <li
                    key={loc.id}
                    className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="text-lg font-bold text-gray-900">{loc.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">{line}</p>
                    {phoneDigits ? (
                      <p className="mt-2 text-sm text-gray-700">
                        <a
                          href={`tel:${phoneDigits}`}
                          className="font-medium text-red-800 hover:underline"
                        >
                          {loc.phone}
                        </a>
                      </p>
                    ) : null}
                    {loc.hours ? <p className="mt-2 text-sm text-gray-600">{loc.hours}</p> : null}
                    {loc.distanceMi != null && (
                      <p className="mt-2 text-sm font-medium text-red-800">
                        ~{loc.distanceMi.toFixed(1)} mi away
                      </p>
                    )}
                    {userPos && !hasCoords(loc) && (
                      <p className="mt-2 text-sm text-gray-500">Distance unavailable for this location.</p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-900"
                      >
                        Get directions
                      </a>
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                      >
                        Order from menu
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto max-w-3xl px-4 text-center text-sm text-gray-600">
          <p>
            Minimum order and delivery areas may vary by location. Menu and prices are subject to change. Delivery
            fees are not tips for drivers.
          </p>
          <p className="mt-4">
            <Link to="/" className="font-medium text-red-800 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
