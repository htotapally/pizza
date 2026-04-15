import { useMemo } from 'react'
import { haversineMiles, hasCoords, matchesQuery } from './locationUtils.js'

export function useOrderedLocations(storeLocations, query, userPos) {
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

  const areaLabel = query.trim() || (userPos ? 'Near you' : 'All locations')

  return { ordered, areaLabel }
}
