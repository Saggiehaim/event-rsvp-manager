// Azure KV shim import replacing Spark runtime for persistence
import { useKV } from '@/hooks/azureKV'

export const GOOGLE_MAPS_API_KEY_STORAGE = 'google-maps-api-key'

export function useGoogleMapsApiKey() {
  return useKV<string>(GOOGLE_MAPS_API_KEY_STORAGE, '')
}
