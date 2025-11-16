export interface Event {
  id: string
  name: string
  location: string
  locationName?: string
  locationCoordinates?: {
    lat: number
    lng: number
  }
  posterUrl: string
  createdAt: number
  rsvps: RSVP[]
}

export interface RSVP {
  id: string
  guestName: string
  attendeeCount: number
  timestamp: number
}
