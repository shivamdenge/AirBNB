import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/services';
import type { HotelPriceDto } from '../types/api';

export function HomePage() {
  const [form, setForm] = useState({
    city: 'Delhi',
    startDate: '2026-03-01',
    endDate: '2026-03-03',
    roomsCount: 1
  });
  const [results, setResults] = useState<HotelPriceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const page = await api.searchHotels(form);
      setResults(page.content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Find your next stay</h1>
      <form className="card grid" onSubmit={onSearch}>
        <label>
          City
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </label>
        <label>
          Check in
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </label>
        <label>
          Check out
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </label>
        <label>
          Rooms
          <input
            type="number"
            min={1}
            value={form.roomsCount}
            onChange={(e) => setForm({ ...form, roomsCount: Number(e.target.value) })}
          />
        </label>
        <button className="btn-primary" disabled={loading}>{loading ? 'Searching...' : 'Search Hotels'}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="list">
        {results.map((item) => (
          <article key={item.hotel.id} className="card">
            <h3>{item.hotel.name}</h3>
            <p>{item.hotel.city}</p>
            <p>From ₹{item.price}/night</p>
            <Link to={`/hotels/${item.hotel.id}`}>View details</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
