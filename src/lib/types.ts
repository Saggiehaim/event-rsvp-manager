export interface Event {
  id: string
  name: string
  location: string
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
