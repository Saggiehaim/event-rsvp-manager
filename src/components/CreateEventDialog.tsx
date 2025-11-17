import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from './ImageUpload'
import { LocationInput } from './LocationInput'
import { CalendarPlus, CalendarBlank, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface CreateEventDialogProps {
  onEventCreated: (event: Event) => void
  googleApiKey?: string
}

export function CreateEventDialog({ onEventCreated, googleApiKey }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [locationName, setLocationName] = useState('')
  const [locationCoordinates, setLocationCoordinates] = useState<{ lat: number; lng: number } | undefined>()
  const [posterUrl, setPosterUrl] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddressChange = (address: string, coordinates?: { lat: number; lng: number }) => {
    setLocation(address)
    setLocationCoordinates(coordinates)
  }

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
      description: description.trim() || undefined,
      location: location.trim(),
      locationName: locationName.trim() || undefined,
      locationCoordinates,
      posterUrl: posterUrl || '',
      createdAt: Date.now(),
      eventDate: eventDate ? new Date(eventDate).getTime() : undefined,
      eventTime: eventTime || undefined,
      rsvps: []
    }

    onEventCreated(newEvent)
    
    toast.success('Event created successfully!')
    
    setName('')
    setDescription('')
    setLocation('')'')
    setLocation('')
    setLocationName('')
    setLocationCoordinates(undefined)
    setPosterUrl('')
    setEventDate('')
    setEventTime('')
    setIsSubmitting(false)
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setName('')
      setLocation('')
      setLocationName('')
      setLocationCoordinates(undefined)
      setPosterUrl('')
      setEventDate('')
      setEventTime('')
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
            <Label htmlFor="event-description">
              Description
            </Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell guests what to expect..."
              rows={3}
              className="text-base resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event-date" className="flex items-center gap-2">
                <CalendarBlank size={16} weight="duotone" />
                Event Date
              </Label>
              <Input
                id="event-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-time" className="flex items-center gap-2">
                <Clock size={16} weight="duotone" />
                Event Time
              </Label>
              <Input
                id="event-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          <LocationInput
            address={location}
            locationName={locationName}
            onAddressChange={handleAddressChange}
            onLocationNameChange={setLocationName}
            googleApiKey={googleApiKey}
          />

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
