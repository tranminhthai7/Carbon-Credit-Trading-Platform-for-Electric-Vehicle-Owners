import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function CvaLayout() {
  const { logout } = useAuth();
  return (
    <div>
      <h3>CVA</h3>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/cva">Issuance Review</Link>
      </nav>
      <button onClick={logout}>Logout</button>
      <Outlet />
    </div>
  );
}


