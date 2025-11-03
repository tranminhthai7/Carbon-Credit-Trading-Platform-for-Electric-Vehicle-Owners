import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function BuyerLayout() {
  const { logout } = useAuth();
  return (
    <div>
      <h3>Buyer</h3>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/buyer">Marketplace</Link>
        <Link to="/buyer/orders">Orders</Link>
        <Link to="/buyer/certificates">Certificates</Link>
        <button onClick={logout}>Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}


