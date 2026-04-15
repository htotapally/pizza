import React from 'react'
import { Link } from 'react-router-dom'
import { formatLineAddress, hasCoords } from './locationUtils.js'

export default function LocationCard({ loc, userPos }) {
  const line = formatLineAddress(loc)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(line)}`
  const phoneDigits = loc.phone ? String(loc.phone).replace(/\D/g, '') : ''

  return (
    <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-lg font-bold text-gray-900">{loc.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{line}</p>
      {phoneDigits ? (
        <p className="mt-2 text-sm text-gray-700">
          <a href={`tel:${phoneDigits}`} className="font-medium text-red-800 hover:underline">
            {loc.phone}
          </a>
        </p>
      ) : null}
      {loc.hours ? <p className="mt-2 text-sm text-gray-600">{loc.hours}</p> : null}
      {loc.distanceMi != null && (
        <p className="mt-2 text-sm font-medium text-red-800">~{loc.distanceMi.toFixed(1)} mi away</p>
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
}
