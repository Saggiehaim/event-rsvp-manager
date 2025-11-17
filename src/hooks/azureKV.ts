import { useEffect, useState, useCallback, useRef } from 'react'

// Generic hook mimicking Spark useKV semantics via Azure Functions HTTP endpoints.
// Returns [value, setter]. Setter replaces value entirely (like original pattern used here).
// Key is stored in Azure Table via kv-get/kv-set functions.

export function useAzureKV<T>(key: string, defaultValue: T): [T, (updater: (current: T) => T) => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // Special handling for events array
        if (key === 'events') {
          const res = await fetch('/api/events')
          if (!res.ok) throw new Error('Failed to fetch events')
          const events = await res.json()
          if (!cancelled) {
            setValue(events as T)
            setLoading(false)
          }
        } else {
          const res = await fetch(`/api/kv/${encodeURIComponent(key)}`)
          if (!res.ok) throw new Error('Failed to fetch KV')
          const data = await res.json()
          if (!cancelled) {
            if (data.value !== null && data.value !== undefined) setValue(data.value as T)
            else setValue(defaultValue)
            setLoading(false)
          }
        }
      } catch (err) {
        console.error(`Failed to load key ${key}:`, err)
        if (!cancelled) {
          setValue(defaultValue)
          setLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [key, defaultValue])

  const setter = useCallback((updater: (current: T) => T) => {
    setValue((current) => {
      const next = updater(current)
      console.log(`[azureKV] Setting key ${key}:`, { current, next })
      
      // Special handling for events array - save each event individually
      if (key === 'events' && Array.isArray(next)) {
        const events = next as any[]
        const currentEvents = current as any[]
        
        // Find which events changed (new or modified)
        const changedEvents = events.filter(event => {
          const existing = currentEvents.find(e => e.id === event.id)
          return !existing || JSON.stringify(existing) !== JSON.stringify(event)
        })
        
        // Find which events were deleted
        const deletedEvents = currentEvents.filter(oldEvent => 
          !events.find(e => e.id === oldEvent.id)
        )
        
        console.log(`[azureKV] Upserting ${changedEvents.length} changed events, deleting ${deletedEvents.length} events`)
        
        // Upsert each changed event
        changedEvents.forEach(event => {
          fetch(`/api/events/${event.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
          }).then(res => {
            if (!res.ok) {
              console.error(`Failed to persist event ${event.id}: ${res.status}`)
              return res.text().then(text => console.error('Response:', text))
            } else {
              console.log(`[azureKV] Successfully persisted event ${event.id}`)
            }
          }).catch(err => {
            console.error(`Network error persisting event ${event.id}:`, err)
          })
        })
        
        // Delete removed events
        deletedEvents.forEach(event => {
          fetch(`/api/events/${event.id}`, {
            method: 'DELETE'
          }).then(res => {
            if (!res.ok) {
              console.error(`Failed to delete event ${event.id}: ${res.status}`)
              return res.text().then(text => console.error('Response:', text))
            } else {
              console.log(`[azureKV] Successfully deleted event ${event.id}`)
            }
          }).catch(err => {
            console.error(`Network error deleting event ${event.id}:`, err)
          })
        })
      } else {
        // Standard KV persistence
        const payload = { value: next }
        console.log(`[azureKV] POST /api/kv/${key}`, payload)
        fetch(`/api/kv/${encodeURIComponent(key)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => {
          if (!res.ok) {
            console.error(`Failed to persist key ${key}: ${res.status} ${res.statusText}`)
            return res.text().then(text => console.error('Response:', text))
          } else {
            console.log(`[azureKV] Successfully persisted key ${key}`)
          }
        }).catch(err => {
          console.error(`Network error persisting key ${key}:`, err)
        })
      }
      
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
