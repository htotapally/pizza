import { useState } from 'react'

export function useLocationGeo() {
  const [userPos, setUserPos] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoMessage, setGeoMessage] = useState(null)

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

  const clearUserLocation = () => {
    setUserPos(null)
    setGeoMessage(null)
  }

  return { userPos, geoLoading, geoMessage, useMyLocation, clearUserLocation }
}
