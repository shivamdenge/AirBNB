# AirBNB Clone — Professional, User-Friendly UI Proposal

Yes — we can build a **modern, professional, and user-friendly UI** for this AirBNB clone.

## Product Direction

A polished experience with:
- Fast hotel discovery
- Clear booking flow
- Trust-focused visuals (ratings, amenities, policies)
- Smooth payment confirmation journey
- A separate manager dashboard for hotel owners

## UX Principles

- **Clarity first**: clean cards, readable typography, clear pricing.
- **Low-friction booking**: step-by-step flow with progress indicators.
- **Trust cues**: cancellation policy, total amount breakdown, status chips.
- **Mobile-first**: responsive layout from phone to desktop.
- **Accessibility**: color contrast, keyboard support, semantic components.

## UI Modules to Build

### 1) Guest App
- Home + search bar (city, dates, rooms)
- Search results with filters and sorting
- Hotel detail page (gallery, room cards, amenities, map/contact)
- Booking wizard:
  1. Select room
  2. Add guests
  3. Payment redirect
  4. Booking status confirmation
- My bookings page
- User profile page

### 2) Manager Dashboard
- Hotel CRUD screens
- Room CRUD screens
- Inventory calendar/update tools
- Booking list and hotel revenue reports

## Visual Style (Professional Look)

- Minimal palette with one brand primary + neutral gray scale
- Rounded cards, subtle shadows, soft spacing system (8px scale)
- Components: sticky search bar, skeleton loaders, toast notifications, empty states
- Consistent status chips (`RESERVED`, `GUESTS_ADDED`, `PAYMENTS_PENDING`, `CONFIRMED`, `CANCELLED`)

## Suggested Frontend Stack

- **React + TypeScript**
- **Next.js** (or Vite if you prefer SPA)
- **Tailwind CSS + shadcn/ui** for clean, production-ready components
- **TanStack Query** for API data and caching
- **Axios** with auth/refresh interceptors
- **Zod + React Hook Form** for robust form validation

## Delivery Plan

### Phase 1 (Foundation)
- Design tokens + component library setup
- Auth screens and token refresh plumbing
- Global API client and response envelope handling

### Phase 2 (Guest Journey)
- Search, hotel detail, booking wizard, payment return pages
- My bookings and profile

### Phase 3 (Manager)
- Hotels, rooms, inventory, reports dashboard

### Phase 4 (Polish)
- Accessibility pass
- Performance tuning
- Final visual refinements and QA

## Immediate Next Step

If you say **"start"**, I’ll generate:
1. Information architecture + route map,
2. Wireframe-level page structure,
3. Component breakdown,
4. API integration contract for each page.
