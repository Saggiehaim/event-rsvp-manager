import { useEffect, useState } from 'react'
// Replacing GitHub Spark KV with Azure-backed KV shim
import { useKV } from '@/hooks/azureKV'
import { Toaster } from '@/components/ui/sonner'
import { CreateEventDialog } from '@/components/CreateEventDialog'
import { EventCard } from '@/components/EventCard'
import { EventDetail } from '@/components/EventDetail'
import { AdminPage } from '@/components/AdminPage'
import { CalendarBlank } from '@phosphor-icons/react'
import { useGoogleMapsApiKeyAzure } from '@/hooks/azureKV'
import type { Event, RSVP } from '@/lib/types'

function App() {
  const [events, setEvents] = useKV<Event[]>('events', [])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [googleApiKey] = useGoogleMapsApiKeyAzure()

  // Helper to set or update meta tags (Open Graph & Twitter)
  const setMetaTag = (attr: 'name' | 'property', key: string, value: string) => {
    if (!value) return
    let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`)
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute(attr, key)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', value)
  }

  const applyDefaultMeta = () => {
    document.title = 'Event Hub - Create & Share Events'
    setMetaTag('property', 'og:title', 'Event Hub')
    setMetaTag('property', 'og:description', 'Create events and invite guests to RSVP')
    setMetaTag('property', 'og:image', '')
    setMetaTag('property', 'og:url', window.location.href)
    setMetaTag('name', 'twitter:card', 'summary')
    setMetaTag('name', 'twitter:title', 'Event Hub')
    setMetaTag('name', 'twitter:description', 'Create events and invite guests to RSVP')
    setMetaTag('name', 'twitter:image', '')
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const eventId = params.get('event')
    const adminPath = params.get('page')
    const pathname = window.location.pathname
    
    if (adminPath === 'shadmin' || pathname === '/shadmin') {
      setIsAdminMode(true)
    } else if (eventId) {
      setSelectedEventId(eventId)
    }
  }, [])

  const handleEventCreated = (newEvent: Event) => {
    setEvents((currentEvents) => [...(currentEvents || []), newEvent])
    setSelectedEventId(newEvent.id)
  }

  const handleRSVPSubmit = (rsvp: RSVP) => {
    setEvents((currentEvents) =>
      (currentEvents || []).map((event) =>
        event.id === selectedEventId
          ? { ...event, rsvps: [...event.rsvps, rsvp] }
          : event
      )
    )
  }

  const handleBack = () => {
    setSelectedEventId(null)
    window.history.pushState({}, '', window.location.pathname)
  }

  const handleAdminBack = () => {
    setIsAdminMode(false)
    window.history.pushState({}, '', window.location.pathname)
  }

  const handleEventUpdate = (eventId: string, updatedFields: Partial<Event>) => {
    setEvents((currentEvents) =>
      (currentEvents || []).map((event) =>
        event.id === eventId ? { ...event, ...updatedFields } : event
      )
    )
  }

  const handleEventDelete = (eventId: string) => {
    console.log('[App] Deleting event', eventId)
    // Direct API call to ensure deletion even if diff detection fails
    fetch(`/api/events/${eventId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) {
          console.error('[App] Event delete failed', eventId, res.status)
          return res.text().then(t => console.error('Response:', t))
        }
        console.log('[App] Event delete request succeeded', eventId)
      })
      .catch(err => console.error('[App] Network error deleting event', eventId, err))
    setEvents((currentEvents) => (currentEvents || []).filter((event) => event.id !== eventId))
  }

  const handleMembersUpdate = (eventId: string, updatedRsvps: RSVP[]) => {
    setEvents((currentEvents) =>
      (currentEvents || []).map((event) =>
        event.id === eventId
          ? { ...event, rsvps: updatedRsvps }
          : event
      )
    )
  }

  const eventsList = events || []
  const selectedEvent = eventsList.find((e) => e.id === selectedEventId)

  // Apply dynamic Open Graph & Twitter metadata when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      // Use event fields
      const title = selectedEvent.name || 'Event'
      const description = selectedEvent.description || 'Join us for this event.'
      const image = selectedEvent.posterUrl || ''
      document.title = `${title} – Event Hub`

      setMetaTag('property', 'og:title', title)
      setMetaTag('property', 'og:description', description)
      if (image) setMetaTag('property', 'og:image', image)
      setMetaTag('property', 'og:type', 'website')
      setMetaTag('property', 'og:url', window.location.href)

      // Twitter tags
      setMetaTag('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
      setMetaTag('name', 'twitter:title', title)
      setMetaTag('name', 'twitter:description', description)
      if (image) setMetaTag('name', 'twitter:image', image)
    } else {
      applyDefaultMeta()
    }
  }, [selectedEvent])

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPage
          events={eventsList}
          onBack={handleAdminBack}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          onMembersUpdate={handleMembersUpdate}
          googleApiKey={googleApiKey}
        />
        <Toaster position="top-center" />
      </div>
    )
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <EventDetail
          event={selectedEvent}
          onBack={handleBack}
          onRSVPSubmit={handleRSVPSubmit}
        />
        <Toaster position="top-center" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <CalendarBlank size={40} weight="duotone" className="text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Event Hub
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Create events and invite guests to RSVP
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <CreateEventDialog onEventCreated={handleEventCreated} googleApiKey={googleApiKey} />
          </div>
        </div>

        {eventsList.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-primary/10 p-6">
                <CalendarBlank size={64} weight="duotone" className="text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">No events yet</h2>
                <p className="max-w-sm text-muted-foreground">
                  Create your first event to get started. Add a poster, name, and location
                  to share with your guests.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {eventsList.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => {
                  setSelectedEventId(event.id)
                  window.history.pushState({}, '', `?event=${event.id}`)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Toaster position="top-center" />
    </div>
  )
}

export default App