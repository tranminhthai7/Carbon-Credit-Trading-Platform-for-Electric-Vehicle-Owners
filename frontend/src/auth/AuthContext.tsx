import React, { createContext, useContext, useMemo, useState } from 'react';

export type Role = 'EV_OWNER' | 'BUYER' | 'CVA' | 'ADMIN' | null;

type AuthState = {
  role: Role;
  token: string | null;
};

type AuthContextType = {
  auth: AuthState;
  loginAs: (role: Exclude<Role, null>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ role: null, token: null });

  const value = useMemo<AuthContextType>(() => ({
    auth,
    loginAs: (role) => setAuth({ role, token: 'dev-token' }),
    logout: () => setAuth({ role: null, token: null })
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


