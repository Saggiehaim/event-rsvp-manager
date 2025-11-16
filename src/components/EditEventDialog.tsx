import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './ImageUpload'
import { LocationInput } from './LocationInput'
import { CalendarBlank, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface EditEventDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedEvent: Partial<Event>) => void
  googleApiKey?: string
}

export function EditEventDialog({ event, open, onOpenChange, onSave, googleApiKey }: EditEventDialogProps) {
  const [name, setName] = useState(event.name)
  const [location, setLocation] = useState(event.location)
  const [locationName, setLocationName] = useState(event.locationName || '')
  const [locationCoordinates, setLocationCoordinates] = useState(event.locationCoordinates)
  const [posterUrl, setPosterUrl] = useState(event.posterUrl)
  const [eventDate, setEventDate] = useState(event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '')
  const [eventTime, setEventTime] = useState(event.eventTime || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setName(event.name)
    setLocation(event.location)
    setLocationName(event.locationName || '')
    setLocationCoordinates(event.locationCoordinates)
    setPosterUrl(event.posterUrl)
    setEventDate(event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '')
    setEventTime(event.eventTime || '')
  }, [event])

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

    const updatedEvent: Partial<Event> = {
      name: name.trim(),
      location: location.trim(),
      locationName: locationName.trim() || undefined,
      locationCoordinates,
      posterUrl: posterUrl || '',
      eventDate: eventDate ? new Date(eventDate).getTime() : undefined,
      eventTime: eventTime || undefined
    }

    onSave(updatedEvent)
    toast.success('Event updated successfully!')
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-poster">Event Poster</Label>
            <ImageUpload value={posterUrl} onChange={setPosterUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-event-name">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer BBQ Party"
              required
              className="text-base"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-event-date" className="flex items-center gap-2">
                <CalendarBlank size={16} weight="duotone" />
                Event Date
              </Label>
              <Input
                id="edit-event-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-event-time" className="flex items-center gap-2">
                <Clock size={16} weight="duotone" />
                Event Time
              </Label>
              <Input
                id="edit-event-time"
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
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !location.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
