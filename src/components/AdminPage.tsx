import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  PencilSimple, 
  Trash, 
  Users, 
  MapPin,
  CalendarBlank,
  Clock
} from '@phosphor-icons/react'
import { EditEventDialog } from './EditEventDialog'
import { DeleteEventDialog } from './DeleteEventDialog'
import { ManageMembersDialog } from './ManageMembersDialog'
import { SettingsDialog } from './SettingsDialog'
import type { Event } from '@/lib/types'
import { motion } from 'framer-motion'

interface AdminPageProps {
  events: Event[]
  onBack: () => void
  onEventUpdate: (eventId: string, updatedEvent: Partial<Event>) => void
  onEventDelete: (eventId: string) => void
  onMembersUpdate: (eventId: string, rsvpIds: string[]) => void
  googleApiKey?: string
}

export function AdminPage({ 
  events, 
  onBack, 
  onEventUpdate, 
  onEventDelete,
  onMembersUpdate,
  googleApiKey 
}: AdminPageProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  const [managingEvent, setManagingEvent] = useState<Event | null>(null)

  const formatEventDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatEventTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto min-h-screen max-w-7xl space-y-8 p-6 md:p-8"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} weight="bold" />
              Back
            </Button>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Admin Panel
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage all events and attendees
          </p>
        </div>
        <SettingsDialog />
      </div>

      {events.length === 0 ? (
        <Card className="flex min-h-[400px] items-center justify-center p-12">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">No events to manage</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => {
            const totalAttendees = event.rsvps.reduce((sum, rsvp) => sum + rsvp.attendeeCount, 0)
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="flex flex-col gap-6 p-6 md:flex-row">
                    <div className="aspect-[3/4] w-full shrink-0 overflow-hidden rounded-lg bg-muted md:w-48">
                      {event.posterUrl ? (
                        <img
                          src={event.posterUrl}
                          alt={event.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
                          <span className="text-4xl font-bold text-primary">
                            {event.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {event.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="secondary" className="gap-1.5">
                            <Users size={14} weight="duotone" />
                            {event.rsvps.length} {event.rsvps.length === 1 ? 'guest' : 'guests'}
                          </Badge>
                          {totalAttendees > 0 && (
                            <Badge className="gap-1.5 bg-teal/10 text-teal hover:bg-teal/20">
                              <CalendarBlank size={14} weight="duotone" />
                              {totalAttendees} attending
                            </Badge>
                          )}
                        </div>

                        {(event.eventDate || event.eventTime) && (
                          <div className="flex flex-wrap gap-3">
                            {event.eventDate && (
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarBlank size={18} weight="duotone" className="text-primary" />
                                <span className="font-medium text-foreground">
                                  {formatEventDate(event.eventDate)}
                                </span>
                              </div>
                            )}
                            {event.eventTime && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock size={18} weight="duotone" className="text-primary" />
                                <span className="font-medium text-foreground">
                                  {formatEventTime(event.eventTime)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin size={18} weight="duotone" className="mt-0.5 shrink-0" />
                          <div>
                            {event.locationName && (
                              <p className="font-medium text-foreground">{event.locationName}</p>
                            )}
                            <p>{event.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingEvent(event)}
                          className="gap-2"
                        >
                          <PencilSimple size={18} weight="duotone" />
                          Edit Event
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setManagingEvent(event)}
                          className="gap-2"
                        >
                          <Users size={18} weight="duotone" />
                          Manage Members ({event.rsvps.length})
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setDeletingEvent(event)}
                          className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash size={18} weight="duotone" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          onSave={(updatedEvent) => {
            onEventUpdate(editingEvent.id, updatedEvent)
            setEditingEvent(null)
          }}
          googleApiKey={googleApiKey}
        />
      )}

      {deletingEvent && (
        <DeleteEventDialog
          event={deletingEvent}
          open={!!deletingEvent}
          onOpenChange={(open) => !open && setDeletingEvent(null)}
          onConfirm={() => {
            onEventDelete(deletingEvent.id)
            setDeletingEvent(null)
          }}
        />
      )}

      {managingEvent && (
        <ManageMembersDialog
          event={managingEvent}
          open={!!managingEvent}
          onOpenChange={(open) => !open && setManagingEvent(null)}
          onSave={(rsvpIds) => {
            onMembersUpdate(managingEvent.id, rsvpIds)
            setManagingEvent(null)
          }}
        />
      )}
    </motion.div>
  )
}
