'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useOpenfort } from '@openfort/react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
  refreshUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: openfortUser, isLoading, logout } = useOpenfort();
  const [user, setUser] = useState<User | null>(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (openfortPlayerId: string, openfortEmail?: string) => {
    if (fetchingProfile) return;

    setFetchingProfile(true);
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'x-user-id': openfortPlayerId,
        },
      });

      if (response.ok) {
        const supabaseUser = await response.json();

        if (supabaseUser) {
          // User exists in Supabase - use their profile data
          const fullName = supabaseUser.first_name && supabaseUser.surname
            ? `${supabaseUser.first_name} ${supabaseUser.surname}`
            : supabaseUser.first_name || supabaseUser.surname || 'User';

          const profileCompleted = !!(
            supabaseUser.first_name &&
            supabaseUser.surname &&
            supabaseUser.email
          );

          setUser({
            id: openfortPlayerId,
            email: supabaseUser.email || openfortEmail || '',
            first_name: supabaseUser.first_name,
            surname: supabaseUser.surname,
            name: fullName,
            avatar_url: supabaseUser.avatar_url,
            openfort_player_id: openfortPlayerId,
            profile_completed: profileCompleted,
            created_at: supabaseUser.created_at || new Date().toISOString(),
            updated_at: supabaseUser.updated_at || new Date().toISOString(),
          });
        } else {
          // New user - profile not created yet
          setUser({
            id: openfortPlayerId,
            email: openfortEmail || '',
            name: 'User',
            openfort_player_id: openfortPlayerId,
            profile_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic Openfort data
      setUser({
        id: openfortPlayerId,
        email: openfortEmail || '',
        name: 'User',
        openfort_player_id: openfortPlayerId,
        profile_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setFetchingProfile(false);
    }
  }, [fetchingProfile]);

  // Sync Openfort user and fetch Supabase profile
  useEffect(() => {
    if (openfortUser) {
      const openfortUserAny = openfortUser as any;
      fetchUserProfile(openfortUserAny.id, openfortUserAny.email);
    } else {
      setUser(null);
    }
  }, [openfortUser]);

  const refreshUserProfile = useCallback(async () => {
    if (openfortUser) {
      const openfortUserAny = openfortUser as any;
      await fetchUserProfile(openfortUserAny.id, openfortUserAny.email);
    }
  }, [openfortUser, fetchUserProfile]);

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading: isLoading || fetchingProfile, signOut, refreshUserProfile }}>
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
