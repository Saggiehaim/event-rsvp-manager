import { MapPin, Users, CalendarBlank } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Event } from '@/lib/types'
import { motion } from 'framer-motion'

interface EventCardProps {
  event: Event
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const totalAttendees = event.rsvps.reduce((sum, rsvp) => sum + rsvp.attendeeCount, 0)
  const rsvpCount = event.rsvps.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-xl">
        <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
          {event.posterUrl ? (
            <img
              src={event.posterUrl}
              alt={event.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/90 text-4xl font-bold text-primary shadow-lg">
                {event.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3 p-5">
          <div>
            <h3 className="line-clamp-2 text-xl font-bold leading-tight text-foreground">
              {event.name}
            </h3>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin size={18} weight="duotone" className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarBlank size={18} weight="duotone" className="shrink-0" />
            <span>{new Date(event.createdAt).toLocaleDateString()}</span>
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
