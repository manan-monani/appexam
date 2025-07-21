
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { AuthContextType, User } from './types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Validate role to match User interface
    const validateRole = (role: string | undefined): User['role'] => {
      if (role === 'student' || role === 'teacher' || role === 'admin') {
        return role;
      }
      return 'student'; // Fallback to 'student' if role is invalid
    };

    // Fetch initial session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email || '',
              role: validateRole(session.user.role),
            }
          : null
      );
      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email || '',
              role: validateRole(session.user.role),
            }
          : null
      );
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
