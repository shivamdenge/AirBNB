import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/services';
import type { BookingDto, HotelInfoDto } from '../types/api';

export function HotelDetailPage() {
  const { hotelId = '' } = useParams();
  const [data, setData] = useState<HotelInfoDto | null>(null);
  const [booking, setBooking] = useState<BookingDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getHotelInfo(hotelId).then(setData).catch((e) => setError((e as Error).message));
  }, [hotelId]);

  const bookRoom = async (roomId: number) => {
    try {
      const created = await api.createBooking({
        hotelId: Number(hotelId),
        roomId,
        checkInDate: '2026-03-01',
        checkOutDate: '2026-03-03',
        roomsCount: 1
      });
      setBooking(created);
      const session = await api.initiatePayment(created.id);
      window.location.href = session.sessionUrl;
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (!data) return <p>Loading hotel details...</p>;

  return (
    <section>
      <h1>{data.hotel.name}</h1>
      <p>{data.hotel.city}</p>
      {error && <p className="error">{error}</p>}
      {booking && <p>Booking #{booking.id} created. Redirecting to payment...</p>}

      <h2>Available Rooms</h2>
      <div className="list">
        {data.rooms.map((room) => (
          <article key={room.id} className="card">
            <h3>{room.type}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>₹{room.basePrice}/night</p>
            <button className="btn-primary" onClick={() => bookRoom(room.id)}>Book now</button>
          </article>
        ))}
      </div>
    </section>
  );
}
