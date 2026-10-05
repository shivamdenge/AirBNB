import { createContext, useContext, useState } from 'react';
import { api } from '../api/services';
import { tokenStore } from '../api/client';
import type { UserDto } from '../types/api';

interface AuthContextType {
  user: UserDto | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrateProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);

  const login = async (email: string, password: string) => {
    await api.login({ email, password });
    await hydrateProfile();
  };

  const hydrateProfile = async () => {
    const profile = await api.getProfile();
    setUser(profile);
  };

  const logout = () => {
    tokenStore.set(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hydrateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
