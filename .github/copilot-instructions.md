# GitHub Copilot Instructions

## Project Overview

Event Hub is a React 19 + TypeScript event management application built on **GitHub Spark runtime** with persistent KV storage. Users create events with posters, manage RSVPs, and share via unique links. No authentication - events are shared via URL parameters.

## Architecture & Data Flow

### Core State Management
- **Primary storage**: GitHub Spark KV hooks (`useKV`) for persistent data
- **Events**: Stored as `Event[]` array in KV store key `'events'`
- **RSVPs**: Nested within each event object, not separate storage
- **Configuration**: Google Maps API key stored in KV with key `'google-maps-api-key'`

### Navigation Pattern
- **Route-less SPA**: Uses URL params instead of router (`?event=id`, `?page=shadmin`)
- **State-driven navigation**: `selectedEventId` and `isAdminMode` control views
- **History management**: Manual `window.history.pushState()` calls

### Component Communication
```typescript
// Event updates flow upward through callbacks
onEventCreated → handleEventCreated → setEvents
onRSVPSubmit → handleRSVPSubmit → setEvents (with nested RSVP update)
```

## Key Conventions

### File Organization
- **Components**: Flat structure in `/src/components/` (no nested folders except `/ui/`)
- **shadcn/ui**: Pre-built components in `/src/components/ui/`
- **Custom components**: Business logic components at root level
- **Types**: Centralized in `/src/lib/types.ts` (Event, RSVP interfaces)

### Data Patterns
```typescript
// Always use optional chaining for KV data
const eventsList = events || []

// Update nested arrays immutably
setEvents((currentEvents) =>
  (currentEvents || []).map((event) =>
    event.id === targetId ? { ...event, rsvps: [...event.rsvps, newRsvp] } : event
  )
)
```

### Icon System
- **Primary**: Phosphor Icons (`@phosphor-icons/react`) with `weight="duotone"` for primary actions
- **Usage**: Import specific icons, not default export
- **Consistent sizing**: `size={24}` for inline, `size={40}` for headers

### Image Handling
- **Upload**: Base64 data URLs via FileReader (see `ImageUpload.tsx`)
- **Validation**: 5MB limit, image MIME types only
- **Fallbacks**: Placeholder with initials on colored background

## Development Workflow

### Essential Commands
```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint validation
```

### GitHub Spark Integration
- **KV Storage**: Use `useKV<Type>('key', defaultValue)` hook pattern
- **No backend needed**: Spark runtime provides persistent storage
- **Deployment**: Automatic GitHub Pages deployment via Actions

### Styling Approach
- **Tailwind CSS v4**: Latest version with container queries
- **Design system**: Colors defined in PRD.md - Deep Purple primary, Coral secondary
- **Animations**: Framer Motion for spring animations and hover states
- **Responsive**: Mobile-first with `md:` breakpoints

## Critical Integration Points

### Google Maps API (Optional)
- **Autocomplete**: Falls back to OpenStreetMap if no API key configured
- **Storage**: API key persisted in KV store for user preference
- **Location data**: Coordinates saved for map integration

### Admin Panel Access
- **URLs**: `?page=shadmin` or `/shadmin` path triggers admin mode
- **Capabilities**: Edit/delete events, bulk member management
- **Security**: No authentication - relies on URL obscurity

### Event Sharing
- **Link format**: `?event={eventId}` parameter
- **UUID generation**: `crypto.randomUUID()` for event IDs
- **Direct access**: Anyone with link can view and RSVP

## Common Patterns

When adding new features:
1. **Update types** in `/src/lib/types.ts` first
2. **Use KV storage** for persistence with proper defaults
3. **Handle loading states** with optional chaining
4. **Add animations** with Framer Motion for interactions
5. **Follow mobile-first** responsive design patterns

For CRUD operations:
- Events are immutably updated via `setEvents` callback
- RSVPs are nested updates within event objects
- Always use spread syntax for state updates
- Validate data before persisting to KV store