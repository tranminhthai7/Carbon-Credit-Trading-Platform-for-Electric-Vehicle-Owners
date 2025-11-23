import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import getDashboardPathForRole from '../../utils/navigation';

const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const path = user ? getDashboardPathForRole(user.role) : '/login';
    navigate(path, { replace: true });
  }, [user, navigate]);

  return null;
};

export default DashboardRedirect;
