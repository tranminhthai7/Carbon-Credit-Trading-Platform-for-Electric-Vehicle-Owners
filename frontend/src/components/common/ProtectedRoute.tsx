import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { CircularProgress, Box, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated, refreshUser } = useAuth();
  const [verifying, setVerifying] = React.useState(false);
  const location = useLocation();

  const isRoleAllowed = React.useMemo(() => {
    if (!allowedRoles || !user) {
      return true;
    }

    return allowedRoles.includes(user.role);
  }, [allowedRoles, user]);

  React.useEffect(() => {
    // When we have a token in storage, always verify the session with the server
    // before rendering protected content. This prevents a malicious/stale
    // localStorage 'user' + 'token' combo from granting access without server validation.
    const token = localStorage.getItem('token');
    if (!loading && token) {
      (async () => {
        try {
          setVerifying(true);
          await refreshUser();
        } finally {
          setVerifying(false);
        }
      })();
    }
  }, [loading, refreshUser]);

  if (loading || verifying) {
    return (
      <Box
        role="status"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
        aria-live="polite"
      >
        <CircularProgress aria-hidden />
        <Typography component="span" variant="body2">
          Loading your dashboard&hellip;
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isRoleAllowed) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
