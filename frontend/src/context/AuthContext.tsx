import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/auth.service';
import { handleApiError } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isProcessing: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string,
  ) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  lastUpdatedAt: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    value: storedUser,
    setValue: setStoredUser,
    removeValue: removeStoredUser,
  } = useLocalStorage<User | null>({
    key: 'user',
    defaultValue: null,
  });

  const [user, setUser] = useState<User | null>(storedUser);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    // Initialize auth state on mount.
    // If a token is present but we don't have a parsed user in localStorage,
    // try to fetch the current profile so pages protected by the route guard
    // (e.g. /owner/trips) don't force a redirect when the user has a valid token.
    (async () => {
      try {
        setLoading(true);

        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setStoredUser(currentUser);
          setLastUpdatedAt(Date.now());
          return;
        }

        // No parsed user in memory, but there might still be a token saved.
        // If we have a token we attempt to pull the profile from the API.
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const profile = await authService.getProfile();
            // getProfile will also persist the user into localStorage
            handleSuccess(profile);
            return;
          } catch (e) {
            // If profile fetch fails we should attempt a token refresh before
            // giving up — this handles short-lived tokens that require a refresh
            // endpoint to mint a new token.
            // eslint-disable-next-line no-console
            console.debug('[AuthProvider] getProfile failed during init, attempting refresh', e);
            try {
              const refreshed = await authService.refresh();
              if (refreshed && refreshed.user) {
                handleSuccess(refreshed.user);
                return;
              }
            } catch (refreshErr) {
              // Refresh failed - we'll fall back to storedUser or treat as unauthenticated.
              // eslint-disable-next-line no-console
              console.debug('[AuthProvider] token refresh during init failed', refreshErr);
            }
          }
        }

        if (storedUser) {
          setUser(storedUser);
          setLastUpdatedAt(Date.now());
        }
      } finally {
        setLoading(false);
      }
    })();
    // we only want to run this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storedUser === null) {
      return;
    }
    setUser(storedUser);
  }, [storedUser]);

  const handleSuccess = useCallback(
    (nextUser: User) => {
      setUser(nextUser);
      setStoredUser(nextUser);
      setError(null);
      setLastUpdatedAt(Date.now());
    },
    [setStoredUser],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsProcessing(true);
      setError(null);
      try {
        const response = await authService.login({ email, password });
        handleSuccess(response.user);
        return response;
      } catch (err) {
        // Use centralized API error parser when possible so UI receives
        // the server's helpful message (e.g. validation/duplicate errors)
        const message = handleApiError(err) || getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [handleSuccess],
  );

  const register = useCallback(
    async (email: string, password: string, name: string, role: UserRole, phone?: string) => {
      setIsProcessing(true);
      setError(null);
      try {
        const response = await authService.register({
          email,
          password,
          full_name: name,
          role,
          ...(phone && { phone }),
        });
        handleSuccess(response.user);
        return response;
      } catch (err) {
        // Prefer the API-provided message (if available) for better UX
        const message = handleApiError(err) || getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [handleSuccess],
  );

  const logout = useCallback(() => {
    authService.logout();
    removeStoredUser();
    setUser(null);
    setLastUpdatedAt(null);
    setError(null);
  }, [removeStoredUser]);

  const refreshUser = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
      try {
        const profile = await authService.getProfile();
        handleSuccess(profile);
        return profile;
      } catch (err) {
        const message = handleApiError(err) || getErrorMessage(err);
        setError(message);
        return null;
      } finally {
      setIsProcessing(false);
    }
  }, [handleSuccess]);

  const clearError = useCallback(() => setError(null), []);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user],
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) {
        return false;
      }
      return roles.includes(user.role);
    },
    [user],
  );

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isProcessing,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError,
      isAuthenticated: !!user,
      hasRole,
      hasAnyRole,
      lastUpdatedAt,
    }),
    [
      clearError,
      error,
      hasAnyRole,
      hasRole,
      isProcessing,
      lastUpdatedAt,
      loading,
      login,
      logout,
      refreshUser,
      register,
      user,
    ],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
