# Frontend Analysis & Integration Guide

This repository is a **Spring Boot backend API** (no frontend app exists in this repo today). The notes below summarize how to build a frontend against it safely and quickly.

## 1) Project shape (frontend-relevant)

- Stack: Spring Boot REST API with JWT auth + Stripe checkout webhook flow.
- Global context path: `/api/v1` (all endpoints are prefixed with this).
- API responses are wrapped in a common envelope (`timeStamp`, `data`, `error`) by global response advice.

## 2) Base URL and response contract

### Base URL

Use:

- `http://<backend-host>:<port>/api/v1`

Example local backend URL:

- `http://localhost:8080/api/v1`

### Standard response envelope

Most endpoints return:

```json
{
  "timeStamp": "2026-02-07T10:00:00",
  "data": { "...": "..." },
  "error": null
}
```

Error shape:

```json
{
  "timeStamp": "2026-02-07T10:00:00",
  "data": null,
  "error": {
    "status": "UNAUTHORIZED",
    "message": "...",
    "subErrors": []
  }
}
```

## 3) Authentication model (frontend must implement)

### Auth endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`

### Login flow

1. Call `/auth/login` with `{ email, password }`.
2. Backend returns `data.accessToken`.
3. Backend also sets an **HttpOnly cookie** named `refreshToken`.

### Calling protected endpoints

Send header:

- `Authorization: Bearer <accessToken>`

### Refresh flow

- Call `POST /auth/refresh` (browser must send cookies with request).
- Backend reads `refreshToken` cookie and issues a new access token.

### Frontend recommendation

- Keep access token in memory (or short-lived storage).
- Configure HTTP client with:
  - `withCredentials: true` (for cookie-based refresh), and
  - request interceptor for `Authorization` header.
- On 401, try refresh once, then retry the failed request.

## 4) Route groups and authorization

### Public routes

- `/auth/**`
- `/hotels/**`
- `/webhook/**` (server-side Stripe callback; frontend typically does not call this)

### Authenticated routes

- `/bookings/**`
- `/users/**`

### Hotel manager only

- `/admin/**` requires role `HOTEL_MANAGER`

## 5) Endpoint map for frontend pages

## 5.1 Browse/Search (public)

- `GET /hotels/search`
  - **Important**: this GET expects a JSON **request body** (`HotelSearchRequest`) which is unusual.
  - request body:
    - `city: string`
    - `startDate: yyyy-MM-dd`
    - `endDate: yyyy-MM-dd`
    - `roomsCount: number`
    - `page?: number` (default 0)
    - `size?: number` (default 10)
  - returns paginated `Page<HotelPriceDto>`

- `GET /hotels/{hotelId}/info`
  - returns hotel details plus room list (`HotelInfoDto`)

## 5.2 User profile (authenticated)

- `GET /users/profile` → current user profile (`UserDto`)
- `PATCH /users/profile` → partial profile update
- `GET /users/myBookings` → list of current user bookings

## 5.3 Booking flow (authenticated)

- `POST /bookings/init`
  - creates reservation; status starts as `RESERVED`

- `POST /bookings/{bookingId}/addGuests`
  - payload: array of guests
  - moves status to `GUESTS_ADDED`

- `POST /bookings/{bookingId}/payments`
  - returns `{ sessionUrl }`
  - frontend should redirect browser to Stripe checkout URL

- `POST /bookings/{bookingId}/status`
  - polling endpoint to read booking state

- `POST /bookings/{bookingId}/cancel`
  - only confirmed booking can be cancelled

## 5.4 Manager/admin routes (role: HOTEL_MANAGER)

### Hotels

- `POST /admin/hotels`
- `GET /admin/hotels`
- `GET /admin/hotels/{hotelId}`
- `PUT /admin/hotels/{hotelId}`
- `DELETE /admin/hotels/{hotelId}`
- `PATCH /admin/hotels/{hotelId}/activate`
- `GET /admin/hotels/{hotelId}/bookings`
- `GET /admin/hotels/{hotelId}/reports?startDate=...&endDate=...`

### Rooms

- `POST /admin/hotels/{hotelId}/rooms`
- `GET /admin/hotels/{hotelId}/rooms`
- `GET /admin/hotels/{hotelId}/rooms/{roomId}`
- `PUT /admin/hotels/{hotelId}/rooms/{roomId}`
- `DELETE /admin/hotels/{hotelId}/rooms/{roomId}`

### Inventory

- `GET /admin/inventory/rooms/{roomId}`
- `PATCH /admin/inventory/rooms/{roomId}`

## 6) Core DTOs your frontend should model

- `UserDto`: `id, email, name, gender, dateOfBirth`
- `LoginResponseDto`: `accessToken`
- `HotelDto`: `id, name, city, photos[], amenities[], contactInfo, active`
- `RoomDto`: `id, type, basePrice, photos[], amenities[], totalCount, capacity`
- `HotelInfoDto`: `{ hotel: HotelDto, rooms: RoomDto[] }`
- `HotelPriceDto`: `{ hotel, price }`
- `BookingDto`:
  - `id, roomsCount, checkInDate, checkOutDate, createdAt, updatedAt, bookingStatus, guests[], amount`
- `InventoryDto`:
  - `id, date, bookedCount, reservedCount, totalCount, surgeFactor, price, closed, createdAt, updatedAt`

## 7) Booking status state machine (UI logic)

Expected sequence:

- `RESERVED` → `GUESTS_ADDED` → `PAYMENTS_PENDING` → `CONFIRMED`

Other terminal states:

- `CANCELLED`
- `EXPIRED` (concept exists; expiry check is based on ~10 minutes during key booking operations)

## 8) Stripe + frontend coordination

- Payment session creation uses frontend URLs from backend config:
  - success: `<frontend.url>/payments/success`
  - failure: `<frontend.url>/payments/failure`
- Frontend should provide routes/pages for:
  - `/payments/success`
  - `/payments/failure`
- Booking confirmation ultimately happens after Stripe webhook callback on backend.

## 9) Frontend architecture suggestion

Implement two apps or two role sections:

1. **Guest app**
   - Search hotels
   - Hotel detail + rooms
   - Booking wizard (init → guests → payment redirect → status)
   - My bookings + profile

2. **Manager dashboard**
   - Hotel CRUD and activation
   - Room CRUD
   - Inventory calendar updates
   - Bookings and revenue report

## 10) Important caveats discovered (build around these)

1. `GET /hotels/search` with request body is non-standard; use an HTTP client that supports body on GET, or request backend change to POST/query params.
2. Refresh token cookie is created without explicit `Secure`, `SameSite`, `Path`, or `Max-Age`; production behavior can vary by browser/deployment.
3. `UnAuthorisedException` may surface as generic server error unless additional exception handling is added.
4. `HotelPriceDto` includes a `Hotel` entity object (not `HotelDto`) so payload can be richer than expected.
5. Ensure CORS + credentials are configured correctly in deployment for cookie-based refresh to work.

## 11) Minimum frontend implementation checklist

- [ ] Auth store with access token + refresh logic.
- [ ] Shared API client that unwraps `{ timeStamp, data, error }`.
- [ ] Role guard for manager-only routes (`HOTEL_MANAGER`).
- [ ] Search/list/detail booking journey pages.
- [ ] Stripe redirect handling on success/failure pages.
- [ ] Poll booking status after payment return.
- [ ] Profile and my bookings pages.
- [ ] Manager modules: hotels, rooms, inventory, reports.

