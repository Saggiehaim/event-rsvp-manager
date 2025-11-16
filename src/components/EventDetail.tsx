import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Copy, Check, ArrowLeft, Users, CalendarBlank } from '@phosphor-icons/react'
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
    const url = `${window.location.origin}${window.location.pathname}?event=${event.id}`
    
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
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={24} weight="duotone" className="shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base text-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarBlank size={24} weight="duotone" className="shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-base text-foreground">
                      {new Date(event.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
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
