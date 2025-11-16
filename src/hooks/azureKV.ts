import { useEffect, useState, useCallback, useRef } from 'react'

// Generic hook mimicking Spark useKV semantics via Azure Functions HTTP endpoints.
// Returns [value, setter]. Setter replaces value entirely (like original pattern used here).
// Key is stored in Azure Table via kv-get/kv-set functions.

export function useAzureKV<T>(key: string, defaultValue: T): [T, (updater: (current: T) => T) => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const initialized = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/kv/${encodeURIComponent(key)}`)
        if (!res.ok) throw new Error('Failed to fetch KV')
        const data = await res.json()
        if (!cancelled) {
          if (data.value !== null && data.value !== undefined) setValue(data.value as T)
          else setValue(defaultValue)
        }
      } catch {
        if (!cancelled) setValue(defaultValue)
      }
    }
    if (!initialized.current) {
      initialized.current = true
      load()
    }
    return () => { cancelled = true }
  }, [key, defaultValue])

  const setter = useCallback((updater: (current: T) => T) => {
    setValue((current) => {
      const next = updater(current)
      // Persist
      fetch(`/api/kv/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next })
      }).catch(() => {/* ignore optimistic failure */})
      return next
    })
  }, [key])

  return [value, setter]
}

// Shim with original name so minimal import refactors.
export const useKV = useAzureKV

export function useGoogleMapsApiKeyAzure(): [string, (updater: (current: string) => string) => void] {
  // For now reflect a writable key persisted through KV table under separate key to avoid exposing secret unnecessarily.
  // If secret must remain server-only, front-end should call a proxy endpoint without returning raw key.
  return useAzureKV<string>('google-maps-api-key', '')
}
