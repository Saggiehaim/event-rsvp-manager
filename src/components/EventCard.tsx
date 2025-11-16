import { MapPin, Users, CalendarBlank, Clock } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types'

interface EventCardProps {
  event: Event
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const rsvpCount = event.rsvps.length
  const totalAttendees = event.rsvps.reduce((sum, rsvp) => sum + (rsvp.attendeeCount || 1), 0)

  const formatEventDate = () => {
    if (!event.eventDate) return null
    return new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatEventTime = () => {
    if (!event.eventTime) return null
    const [hours, minutes] = event.eventTime.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {event.posterUrl && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={event.posterUrl}
              alt={event.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-4 p-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground line-clamp-2">
              {event.name}
            </h3>
          </div>

          {(event.eventDate || event.eventTime) && (
            <div className="space-y-2">
              {event.eventDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarBlank size={18} weight="duotone" className="shrink-0" />
                  <span className="font-medium">{formatEventDate()}</span>
                </div>
              )}
              {event.eventTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={18} weight="duotone" className="shrink-0" />
                  <span className="font-medium">{formatEventTime()}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin size={18} weight="duotone" className="mt-0.5 shrink-0" />
            <div className="line-clamp-2">
              {event.locationName && (
                <span className="font-medium text-foreground">{event.locationName} - </span>
              )}
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2 text-sm">
              <Users size={18} weight="duotone" className="text-primary" />
              <span className="font-medium text-foreground">
                {rsvpCount} {rsvpCount === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            
            {totalAttendees > 0 && (
              <Badge variant="secondary" className="bg-teal/10 text-teal hover:bg-teal/20">
                {totalAttendees} attending
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
