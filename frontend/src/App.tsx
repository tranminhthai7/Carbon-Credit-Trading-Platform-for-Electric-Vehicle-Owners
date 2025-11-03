import { Outlet, Link, useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.4 }}>
      <header style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee' }}>
        <strong>EV Carbon Credits</strong>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Marketplace</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </nav>
        <span style={{ marginLeft: 'auto', color: '#888' }}>{location.pathname}</span>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}


