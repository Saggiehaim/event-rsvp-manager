import { MapPin, Users, CalendarBlank, Clock } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Event } from '@/lib/types'
  onClick: () => void

  const totalAttendees = e
  event: Event
    if (!event.eventD
 

    })

    if (!event.eventTime) return null

    const displayHour = hour % 12
    if (!event.eventDate) return null
    return new Date(event.eventDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
   

  const formatEventTime = () => {
    if (!event.eventTime) return null
    const [hours, minutes] = event.eventTime.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
   

          
               
                  <span className="fo
              )}
                <div className="flex
                  <span className="font-m
              )}
          )}
     
            <div className="line-clamp-2">
                <span className="font-medium text-foreground">{event.l
              <span>{event.loc
          </div>
          <div className="flex item
              <Users size={18}
                {rsvpCount} {rsvpCount === 1 ? 'Guest' : 'Guests'}
            </
            {to
                {totalAttendees} attending
            )}
        </div>
    </motion.div>
}







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
