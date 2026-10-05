import { useEffect, useState } from 'react';
import { api } from '../api/services';

export function ManagerPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getManagerHotels().then(setHotels).catch((e) => setError((e as Error).message));
  }, []);

  return (
    <section>
      <h1>Manager Dashboard</h1>
      <p>Hotels you own/manage.</p>
      {error && <p className="error">{error}</p>}
      <div className="list">
        {hotels.map((hotel) => (
          <article className="card" key={hotel.id}>
            <h3>{hotel.name}</h3>
            <p>{hotel.city}</p>
            <p>Active: {String(hotel.active)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
