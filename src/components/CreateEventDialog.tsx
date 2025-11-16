import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './ImageUpload'
import { CalendarPlus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface CreateEventDialogProps {
  onEventCreated: (event: Event) => void
}

export function CreateEventDialog({ onEventCreated }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !location.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    const newEvent: Event = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      location: location.trim(),
      posterUrl: posterUrl || '',
      createdAt: Date.now(),
      rsvps: []
    }

    onEventCreated(newEvent)
    
    toast.success('Event created successfully!')
    
    setName('')
    setLocation('')
    setPosterUrl('')
    setIsSubmitting(false)
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setName('')
      setLocation('')
      setPosterUrl('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg">
          <CalendarPlus size={20} weight="duotone" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="poster">Event Poster</Label>
            <ImageUpload value={posterUrl} onChange={setPosterUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-name">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer BBQ Party"
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Main Street, Brooklyn NY"
              required
              className="text-base"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !location.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
