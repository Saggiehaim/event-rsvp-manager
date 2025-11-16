import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { CreateEventDialog } from '@/components/CreateEventDialog'
import { EventCard } from '@/components/EventCard'
import { EventDetail } from '@/components/EventDetail'
import { CalendarBlank } from '@phosphor-icons/react'
import type { Event, RSVP } from '@/lib/types'

function App() {
  const [events, setEvents] = useKV<Event[]>('events', [])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const eventId = params.get('event')
    if (eventId) {
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

  const eventsList = events || []
  const selectedEvent = eventsList.find((e) => e.id === selectedEventId)

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

          <CreateEventDialog onEventCreated={handleEventCreated} />
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