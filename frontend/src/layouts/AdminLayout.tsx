import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div>
      <h3>Admin</h3>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/admin">Users</Link>
        <Link to="/admin/transactions">Transactions</Link>
        <Link to="/admin/disputes">Disputes</Link>
        <Link to="/admin/reports">Reports</Link>
      </nav>
      <button onClick={logout}>Logout</button>
      <Outlet />
    </div>
  );
}


