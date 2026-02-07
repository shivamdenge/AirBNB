import { FormEvent, useState } from 'react';
import { api } from '../api/services';
import { useAuth } from '../contexts/AuthContext';

export function ProfilePage() {
  const { user, hydrateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [status, setStatus] = useState<string | null>(null);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    await api.updateProfile({ name });
    await hydrateProfile();
    setStatus('Profile updated successfully');
  };

  if (!user) return <p>Please login.</p>;

  return (
    <section className="card form-card">
      <h1>My Profile</h1>
      <p>Email: {user.email}</p>
      <form onSubmit={save}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <button className="btn-primary">Save</button>
      </form>
      {status && <p>{status}</p>}
    </section>
  );
}
