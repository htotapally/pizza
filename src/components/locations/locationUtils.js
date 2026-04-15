export function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function formatLineAddress(loc) {
  return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`
}

export function matchesQuery(loc, q) {
  const s = q.trim().toLowerCase()
  if (!s) return true
  const blob = [loc.name, loc.address, loc.city, loc.state, loc.zip, loc.phone].join(' ').toLowerCase()
  return blob.includes(s)
}

export function hasCoords(loc) {
  return (
    typeof loc.lat === 'number' &&
    typeof loc.lng === 'number' &&
    !Number.isNaN(loc.lat) &&
    !Number.isNaN(loc.lng)
  )
}
