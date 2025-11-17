import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UserPlus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { RSVP } from '@/lib/types'
import { motion } from 'framer-motion'

interface RSVPFormProps {
  onSubmit: (rsvp: RSVP) => void
}

export function RSVPForm({ onSubmit }: RSVPFormProps) {
  const [guestName, setGuestName] = useState('')
  const [adults, setAdults] = useState('1')
  const [kids, setKids] = useState('0')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!guestName.trim()) {
      toast.error('Please enter your name')
      return
    }

    const adultsCount = parseInt(adults, 10)
    const kidsCount = parseInt(kids, 10)
    
    if (isNaN(adultsCount) || adultsCount < 0 || isNaN(kidsCount) || kidsCount < 0) {
      toast.error('Please enter valid numbers')
      return
    }

    const totalCount = adultsCount + kidsCount

    setIsSubmitting(true)

    const newRSVP: RSVP = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      guestName: guestName.trim(),
      attendeeCount: totalCount,
      adults: adultsCount,
      kids: kidsCount,
      timestamp: Date.now()
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    onSubmit(newRSVP)
    
    toast.success(totalCount === 0 ? 'Thanks for letting us know!' : `Thanks for your RSVP, ${guestName.trim()}!`)
    
    setGuestName('')
    setAdults('1')
    setKids('0')
    setIsSubmitting(false)
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h3 className="mb-1 text-xl font-semibold text-foreground">RSVP to this event</h3>
          <p className="text-sm text-muted-foreground">Let the host know you're coming</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-name">
            Your Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="guest-name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="John Doe"
            required
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults">
              Adults <span className="text-destructive">*</span>
            </Label>
            <Input
              id="adults"
              type="number"
              min="0"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kids">
              Kids <span className="text-destructive">*</span>
            </Label>
            <Input
              id="kids"
              type="number"
              min="0"
              value={kids}
              onChange={(e) => setKids(e.target.value)}
              required
              className="text-base"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Enter 0 for both if you can't make it
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || !guestName.trim()}
            size="lg"
            className="w-full gap-2 shadow-md"
          >
            <UserPlus size={20} weight="duotone" />
            {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          </Button>
        </motion.div>
      </form>
    </Card>
  )
}
