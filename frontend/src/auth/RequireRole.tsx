import { Navigate, Outlet } from 'react-router-dom';
import { Role, useAuth } from './AuthContext';

export default function RequireRole({ allow }: { allow: Exclude<Role, null>[] }) {
  const { auth } = useAuth();
  if (auth.role && allow.includes(auth.role)) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
}


