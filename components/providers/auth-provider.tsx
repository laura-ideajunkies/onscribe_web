'use client';

import { createContext, useContext, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(null);
  const [loading] = useState(false);

  const signOut = async () => {
    // Will be implemented when Openfort is configured
    console.log('Sign out - configure Openfort to enable');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
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
