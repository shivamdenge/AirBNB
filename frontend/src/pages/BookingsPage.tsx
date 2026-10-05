import { useEffect, useState } from 'react';
import { api } from '../api/services';
import type { BookingDto } from '../types/api';

export function BookingsPage() {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getMyBookings().then(setBookings).catch((e) => setError((e as Error).message));
  }, []);

  return (
    <section>
      <h1>My Bookings</h1>
      {error && <p className="error">{error}</p>}
      <div className="list">
        {bookings.map((booking) => (
          <article key={booking.id} className="card">
            <h3>Booking #{booking.id}</h3>
            <p>{booking.checkInDate} to {booking.checkOutDate}</p>
            <p>Status: {booking.bookingStatus}</p>
            <p>Total: ₹{booking.amount}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
