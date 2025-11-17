import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, UserCircle } from '@phosphor-icons/react'
import type { RSVP } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface GuestListProps {
  rsvps: RSVP[]
}

export function GuestList({ rsvps }: GuestListProps) {
  const totalAttendees = rsvps.reduce((sum, rsvp) => sum + rsvp.attendeeCount, 0)
  const sortedRsvps = [...rsvps].sort((a, b) => b.timestamp - a.timestamp)

  if (rsvps.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-muted p-6">
            <UserCircle size={48} weight="duotone" className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">No RSVPs yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to let everyone know you're coming!
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} weight="duotone" className="text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Guest List</h3>
        </div>
        <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
          {totalAttendees} Total Attending
        </Badge>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedRsvps.map((rsvp) => (
            <motion.div
              key={rsvp.id}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30"
            >
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-base font-semibold text-primary">
                  {rsvp.guestName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{rsvp.guestName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(rsvp.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="text-right shrink-0">
                {rsvp.attendeeCount === 0 ? (
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                    Can't make it
                  </Badge>
                ) : (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-2xl font-bold text-primary">
                      {rsvp.attendeeCount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {rsvp.adults > 0 && `${rsvp.adults} adult${rsvp.adults !== 1 ? 's' : ''}`}
                      {rsvp.adults > 0 && rsvp.kids > 0 && ', '}
                      {rsvp.kids > 0 && `${rsvp.kids} kid${rsvp.kids !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  )
}
