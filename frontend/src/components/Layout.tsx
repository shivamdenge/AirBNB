import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="logo">AirBNB Clone</Link>
        <nav>
          <NavLink to="/">Search</NavLink>
          <NavLink to="/bookings">My Bookings</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/manager">Manager</NavLink>
          {user ? (
            <button onClick={logout} className="btn-secondary">Logout</button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
