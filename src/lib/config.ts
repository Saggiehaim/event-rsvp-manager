import { useKV } from '@github/spark/hooks'

export const GOOGLE_MAPS_API_KEY_STORAGE = 'google-maps-api-key'

export function useGoogleMapsApiKey() {
  return useKV<string>(GOOGLE_MAPS_API_KEY_STORAGE, '')
}
