import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function OwnerLayout() {
  const { logout } = useAuth();
  return (
    <div>
      <h3>EV Owner</h3>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/owner">Home</Link>
        <Link to="/owner/trips">Trips</Link>
        <Link to="/owner/issuance">Issuance</Link>
        <Link to="/owner/wallet">Wallet</Link>
        <Link to="/owner/listings">Listings</Link>
        <button onClick={logout}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}


