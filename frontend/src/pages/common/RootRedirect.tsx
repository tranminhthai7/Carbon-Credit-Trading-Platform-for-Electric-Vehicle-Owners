import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Always navigate to the public dashboard; it will redirect authenticated users to role specific dashboards.
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default RootRedirect;
