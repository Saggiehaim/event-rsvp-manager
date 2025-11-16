/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

interface Window {
  google?: {
    maps: {
      places: {
        AutocompleteService: new () => {
          getPlacePredictions(
            request: {
              input: string
              types?: string[]
            },
            callback: (
              predictions: Array<{
                description: string
                place_id: string
              }> | null,
              status: string
            ) => void
          ): void
        }
        PlacesServiceStatus: {
          OK: string
        }
      }
      Geocoder: new () => {
        geocode(
          request: { placeId: string },
          callback: (
            results: Array<{
              geometry: {
                location: {
                  lat: () => number
                  lng: () => number
                }
              }
            }> | null,
            status: string
          ) => void
        ): void
      }
      GeocoderStatus: {
        OK: string
      }
    }
  }
}