import React, { useState } from 'react'
import LocationsHero from '../components/locations/LocationsHero.jsx'
import LocationsSearchPanel from '../components/locations/LocationsSearchPanel.jsx'
import LocationsResults from '../components/locations/LocationsResults.jsx'
import LocationsDisclaimer from '../components/locations/LocationsDisclaimer.jsx'
import { useStoreLocations } from '../components/locations/useStoreLocations.js'
import { useLocationGeo } from '../components/locations/useLocationGeo.js'
import { useOrderedLocations } from '../components/locations/useOrderedLocations.js'

export default function Locations() {
  const [query, setQuery] = useState('')
  const { storeLocations, loadState, reloadLocations } = useStoreLocations()
  const { userPos, geoLoading, geoMessage, useMyLocation, clearUserLocation } = useLocationGeo()
  const { ordered, areaLabel } = useOrderedLocations(storeLocations, query, userPos)

  return (
    <div className="text-gray-800">
      <LocationsHero />
      <LocationsSearchPanel
        query={query}
        onQueryChange={setQuery}
        geoLoading={geoLoading}
        geoMessage={geoMessage}
        userPos={userPos}
        onUseMyLocation={useMyLocation}
        onClearUserLocation={clearUserLocation}
      />
      <LocationsResults
        loadState={loadState}
        reloadLocations={reloadLocations}
        storeLocations={storeLocations}
        ordered={ordered}
        areaLabel={areaLabel}
        onClearQuery={() => setQuery('')}
        userPos={userPos}
      />
      <LocationsDisclaimer />
    </div>
  )
}
