import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './ImageUpload'
import { LocationInput } from './LocationInput'
import { CalendarPlus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Event } from '@/lib/types'

interface CreateEventDialogProps {
  onEventCreated: (event: Event) => void
  googleApiKey?: string
}

export function CreateEventDialog({ onEventCreated, googleApiKey }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [locationName, setLocationName] = useState('')
  const [locationCoordinates, setLocationCoordinates] = useState<{ lat: number; lng: number } | undefined>()
  const [posterUrl, setPosterUrl] = useState('')
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
      location: location.trim(),
      locationName: locationName.trim() || undefined,
      locationCoordinates,
      posterUrl: posterUrl || '',
      createdAt: Date.now(),
      rsvps: []
    }

    onEventCreated(newEvent)
    
    toast.success('Event created successfully!')
    
    setName('')
    setLocation('')
    setLocationName('')
    setLocationCoordinates(undefined)
    setPosterUrl('')
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
