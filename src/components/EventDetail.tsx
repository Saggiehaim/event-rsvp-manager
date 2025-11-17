import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Copy, Check, ArrowLeft, Users, CalendarBlank, Clock } from '@phosphor-icons/react'
import { RSVPForm } from './RSVPForm'
import { GuestList } from './GuestList'
import type { Event, RSVP } from '@/lib/types'
import { toast } from 'sonner'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface EventDetailProps {
  event: Event
  onBack: () => void
  onRSVPSubmit: (rsvp: RSVP) => void
}

export function EventDetail({ event, onBack, onRSVPSubmit }: EventDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    // Use /api/share/{id} route for proper OG metadata in social sharing
    const url = `${window.location.origin}/api/share/${event.id}`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const totalAttendees = event.rsvps.reduce((sum, rsvp) => sum + rsvp.attendeeCount, 0)

  const formatEventDate = () => {
    if (!event.eventDate) return null
    return new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} weight="bold" />
          Back to Events
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="gap-2 shadow-sm"
        >
          {copied ? (
            <>
              <Check size={18} weight="bold" className="text-teal" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} weight="duotone" />
              Share Event
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="overflow-hidden shadow-xl">
            <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
              {event.posterUrl ? (
                <img
                  src={event.posterUrl}
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/90 text-6xl font-bold text-primary shadow-xl">
                    {event.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 p-6">
              <div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
                  {event.name}
                </h1>
                {event.description && (
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                {(event.eventDate || event.eventTime) && (
                  <>
                    {event.eventDate && (
                      <div className="flex items-start gap-3">
                        <CalendarBlank size={24} weight="duotone" className="shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Event Date</p>
                          <p className="text-base font-semibold text-foreground">
                            {formatEventDate()}
                          </p>
                        </div>
                      </div>
                    )}

                    {event.eventTime && (
                      <div className="flex items-start gap-3">
                        <Clock size={24} weight="duotone" className="shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Event Time</p>
                          <p className="text-base font-semibold text-foreground">
                            {formatEventTime()}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-start gap-3">
                  <MapPin size={24} weight="duotone" className="shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    {event.locationName && (
                      <p className="text-base font-semibold text-foreground">{event.locationName}</p>
                    )}
                    <p className="text-base text-foreground">{event.location}</p>
                    {event.locationCoordinates && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${event.locationCoordinates.lat},${event.locationCoordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-sm text-primary hover:underline"
                      >
                        View on Google Maps →
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users size={24} weight="duotone" className="shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                    <div className="flex items-center gap-2">
                      <p className="text-base text-foreground">
                        {event.rsvps.length} {event.rsvps.length === 1 ? 'guest' : 'guests'}
                      </p>
                      {totalAttendees > 0 && (
                        <Badge variant="secondary" className="bg-teal/10 text-teal hover:bg-teal/20">
                          {totalAttendees} attending
                        </Badge>
                      )}
                    </div>
                    {totalAttendees > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.rsvps.reduce((sum, rsvp) => sum + rsvp.adults, 0)} adults, {event.rsvps.reduce((sum, rsvp) => sum + rsvp.kids, 0)} kids
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          <RSVPForm onSubmit={onRSVPSubmit} />
          <GuestList rsvps={event.rsvps} />
        </motion.div>
      </div>
    </motion.div>
  )
}
