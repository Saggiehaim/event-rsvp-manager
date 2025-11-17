export interface Event {
  id: string
  name: string
  description?: string
  location: string
  locationName?: string
  locationCoordinates?: {
    lat: number
    lng: number
  }
  posterUrl: string
  createdAt: number
  eventDate?: number
  eventTime?: string
  rsvps: RSVP[]
}

export interface RSVP {
  id: string
  guestName: string
  attendeeCount: number
  adults: number
  kids: number
  timestamp: number
}
