# Planning Guide

A collaborative event management platform that enables hosts to create events with visual posters and essential details, while allowing invited guests to RSVP with their attendance information.

**Experience Qualities**:
1. **Welcoming** - The interface should feel inviting and celebratory, encouraging users to create and join events with enthusiasm
2. **Effortless** - Event creation and RSVP processes should be streamlined with minimal friction, allowing users to complete tasks in seconds
3. **Social** - The design should emphasize connection and anticipation, making guests excited to participate and hosts proud to share their events

**Complexity Level**: Light Application (multiple features with basic state)
  - The app handles event creation, image uploads, and guest list management with persistent storage, but remains focused on core event coordination without complex user accounts or advanced features.

## Essential Features

### Event Creation
- **Functionality**: Host creates an event by uploading a poster image, entering event name, location address (with Google Maps autocomplete), and optional location name
- **Purpose**: Provides a complete event identity with precise location data that can be shared with potential guests
- **Trigger**: User clicks "Create Event" button on landing page
- **Progression**: Click create button → Upload poster image → Enter event name → Type address (see Google Maps suggestions) → Select from autocomplete → Optionally add location name → Submit → Event created with unique shareable link and map coordinates
- **Success criteria**: Event is saved with all details including coordinates, poster displays correctly, unique URL is generated for sharing, location can be opened in Google Maps

### Guest RSVP
- **Functionality**: Guests visit event page and submit their name and number of people attending
- **Purpose**: Allows host to track attendance and plan accordingly
- **Trigger**: Guest visits shared event link
- **Progression**: Open event link → View event details and poster → Enter name → Enter number of attendees → Submit RSVP → See confirmation
- **Success criteria**: RSVP is saved to event, appears in guest list, shows accurate total headcount

### Guest List Display
- **Functionality**: Shows all RSVPs with names and attendee counts, plus total headcount
- **Purpose**: Gives host and guests visibility into who's attending and total expected attendance
- **Trigger**: Automatically displayed on event page
- **Progression**: Load event page → Guest list appears below RSVP form → Updates in real-time as new RSVPs arrive
- **Success criteria**: All RSVPs display correctly, total count is accurate, updates persist across sessions

### Event Sharing
- **Functionality**: Provides shareable link that anyone can access to view event and RSVP
- **Purpose**: Enables easy invitation distribution without complex user management
- **Trigger**: Event creation generates unique URL
- **Progression**: Event created → Copy link button appears → Host shares link via any channel → Recipients access event directly
- **Success criteria**: Link works for all users, event loads correctly, RSVP form is accessible

### Admin Panel
- **Functionality**: Centralized management interface for all events with edit, delete, and member management capabilities
- **Purpose**: Provides event organizers complete control over their events and attendee lists
- **Trigger**: User clicks "Admin Panel" button on main page
- **Progression**: Click Admin Panel → View all events in list format → Select Edit to modify event details → Select Delete to remove event → Select Manage Members to add/remove attendees → Confirm changes → Return to main page
- **Success criteria**: All events display with full details, edit updates persist correctly, delete removes event completely, member management updates RSVP list accurately

## Edge Case Handling

- **Missing poster image**: Display placeholder with event name/initials on colored background
- **Duplicate names**: Allow duplicate entries but show submission timestamp to differentiate
- **Zero attendees**: Allow 0 as valid input for "maybe" responses or declined invitations
- **Long event names/locations**: Truncate with ellipsis on cards, show full text on detail view
- **Invalid image uploads**: Validate file type (images only) and size limit (5MB), show error toast
- **Empty guest list**: Show friendly "No RSVPs yet" message with encouraging copy
- **Deleting events with RSVPs**: Show confirmation dialog with RSVP count warning before deletion
- **Editing events with existing RSVPs**: Allow edits without affecting existing RSVP data
- **Removing all members**: Allow clearing entire guest list if needed, show warning about total removal count

## Design Direction

The design should feel celebratory and warm, like receiving an invitation to something special—elegant but not stuffy, modern but approachable, with a balance toward a rich interface that showcases event posters beautifully while keeping interactions simple and focused.

## Color Selection

Triadic color scheme to create visual energy and celebration while maintaining balance across primary actions, event content, and status indicators.

- **Primary Color**: Deep Purple (oklch(0.45 0.15 290)) - Represents celebration and sophistication, used for primary CTAs and event creation actions
- **Secondary Colors**: 
  - Warm Coral (oklch(0.70 0.14 35)) - Supporting color for secondary actions and RSVP interactions
  - Teal (oklch(0.60 0.12 195)) - Accent for confirmed RSVPs and success states
- **Accent Color**: Vibrant Magenta (oklch(0.65 0.22 330)) - Highlight color for important elements like guest counts and call-to-action buttons
- **Foreground/Background Pairings**:
  - Background (Soft Cream oklch(0.98 0.01 85)): Dark text (oklch(0.25 0.02 290)) - Ratio 11.2:1 ✓
  - Card (White oklch(1 0 0)): Dark text (oklch(0.25 0.02 290)) - Ratio 12.4:1 ✓
  - Primary (Deep Purple oklch(0.45 0.15 290)): White text (oklch(1 0 0)) - Ratio 7.8:1 ✓
  - Secondary (Warm Coral oklch(0.70 0.14 35)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Accent (Vibrant Magenta oklch(0.65 0.22 330)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Muted (Light Purple oklch(0.95 0.02 290)): Medium text (oklch(0.50 0.05 290)) - Ratio 6.8:1 ✓

## Font Selection

Typography should feel contemporary and friendly with excellent readability—a geometric sans-serif that conveys modern sophistication while remaining approachable for social event coordination.

**Primary Font**: Inter - Clean, highly readable, and versatile for both display and body text

- **Typographic Hierarchy**:
  - H1 (Event Name): Inter Bold/32px/tight letter-spacing (-0.02em) - Hero presence on event pages
  - H2 (Section Headers): Inter Semibold/24px/normal letter-spacing - Clear section delineation
  - H3 (Guest Names): Inter Medium/18px/normal letter-spacing - Readable guest list entries
  - Body (Descriptions): Inter Regular/16px/relaxed line-height (1.6) - Comfortable reading
  - Small (Metadata): Inter Regular/14px/normal - Timestamps and secondary info
  - Button Text: Inter Semibold/16px/slight letter-spacing (0.01em) - Clear action labels

## Animations

Animations should feel celebratory but purposeful—subtle springy motions that add delight to interactions without slowing down task completion, with emphasis on making new RSVPs feel rewarding and event creation feel accomplishment-driven.

- **Purposeful Meaning**: Use gentle bounce animations for successful RSVPs to create a micro-celebration moment; smooth scale transitions for event posters to emphasize visual content; fade-in animations for guest list additions to draw attention to new attendees
- **Hierarchy of Movement**: 
  - Primary: RSVP submission success (spring animation with subtle confetti-like visual)
  - Secondary: Event creation completion and image uploads (smooth fade + scale up)
  - Tertiary: List item additions, hover states on cards (subtle lift and shadow expansion)

## Component Selection

- **Components**:
  - Card: Event display cards with poster, name, and location - custom shadow and hover lift effect
  - Button: Primary actions (Create Event, Submit RSVP) using shadcn Button with size="lg" variant="default"
  - Input: Text fields for event name, location, guest name - shadcn Input with focus ring in primary color
  - Dialog: Event creation modal and edit modal - shadcn Dialog for focused creation flow
  - AlertDialog: Destructive confirmation dialogs for delete actions - shadcn AlertDialog
  - Avatar: Guest list entries - shadcn Avatar with initials fallback for visual interest
  - Badge: Attendee count badges - shadcn Badge with custom colors for headcount display
  - ScrollArea: Guest list container and member management - shadcn ScrollArea for long guest lists
  - Checkbox: Member selection in admin panel - shadcn Checkbox for bulk operations
  - Separator: Visual breaks between sections - shadcn Separator
  - Label: Form field labels - shadcn Label with consistent spacing
  
- **Customizations**:
  - Image upload component with drag-and-drop zone and preview
  - Event poster display with aspect ratio lock (3:4 portrait orientation)
  - Guest counter component showing total headcount with animated number transitions
  - Copy-link button with toast confirmation
  - Google Maps location input with autocomplete predictions dropdown
  - Optional location name field for friendly venue naming
  - Admin panel with comprehensive event list view showing all event details
  - Member management dialog with multi-select checkboxes for bulk removal
  - Edit event dialog reusing creation form with pre-populated values
  
- **States**:
  - Buttons: Default (primary gradient), Hover (lifted with enhanced shadow), Active (pressed scale), Loading (spinner), Disabled (muted with reduced opacity)
  - Inputs: Default (subtle border), Focus (primary ring with glow), Error (destructive border), Filled (slightly elevated background)
  - Cards: Default (subtle shadow), Hover (lifted with expanded shadow and subtle scale)
  
- **Icon Selection**:
  - CalendarPlus: Event creation action
  - Image: Poster upload placeholder
  - MapPin: Location indicator
  - Users: Guest list section
  - UserPlus: RSVP action
  - Copy: Share link button
  - Check: Confirmation states
  - X: Close/cancel actions
  - GearSix: Admin panel access
  - PencilSimple: Edit event action
  - Trash: Delete event action
  
- **Spacing**:
  - Container padding: p-6 (24px) for cards, p-8 (32px) for main sections
  - Element gaps: gap-4 (16px) for form fields, gap-6 (24px) for section spacing
  - Grid gaps: gap-8 (32px) for event card grid
  - Consistent margin: mt-6 between major sections
  
- **Mobile**:
  - Single column layout for event cards on mobile (<768px)
  - Full-width dialogs on mobile with sheet-style slide-up animation
  - Stacked form fields with increased touch targets (min 44px height)
  - Poster images scale to full container width while maintaining aspect ratio
  - Guest list uses virtual scrolling for performance with many attendees
  - Bottom-fixed action buttons on mobile for easy thumb access
