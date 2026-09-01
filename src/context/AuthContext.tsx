import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface LocalUserProfile {
  id: string;
  email: string;
  fullName: string;
  discordUsername: string;
  role: string;
}

interface AuthContextType {
  user: User | LocalUserProfile | null;
  session: Session | null;
  loading: boolean;
  userProfile: { fullName?: string; discordUsername?: string; role?: string } | null;
  signUp: (email: string, pass: string, fullName: string, discordUsername: string) => Promise<{ error: string | null }>;
  signIn: (email: string, pass: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'kryonhost_logged_in_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | LocalUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ fullName?: string; discordUsername?: string; role?: string } | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        const u = JSON.parse(saved);
        return { fullName: u.fullName, discordUsername: u.discordUsername, role: u.role || 'Customer' };
      }
      return null;
    } catch (err) {
      return null;
    }
  });

  useEffect(() => {
    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = (currentUser: User) => {
    const meta = currentUser.user_metadata || {};
    const isOwner = currentUser.email?.toLowerCase() === 'tejasjha.in@gmail.com';
    const prof = {
      fullName: meta.full_name || (isOwner ? 'Tejas Jha (Owner)' : currentUser.email?.split('@')[0]) || 'Customer',
      discordUsername: meta.discord_username || 'user',
      role: isOwner ? 'Owner Admin' : meta.role || 'Customer',
    };
    setUserProfile(prof);
    setLoading(false);
  };

  const signUp = async (email: string, pass: string, fullName: string, discordUsername: string) => {
    try {
      const isOwner = email.toLowerCase() === 'tejasjha.in@gmail.com';
      const userRole = isOwner ? 'Owner Admin' : 'Customer';

      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            discord_username: discordUsername,
            role: userRole,
          },
        },
      });

      // Instant local login state even if confirmation email is pending
      const newUser: LocalUserProfile = {
        id: data.user?.id || `usr-cust-${Date.now()}`,
        email,
        fullName,
        discordUsername,
        role: userRole,
      };

      setUser(newUser);
      setUserProfile({
        fullName,
        discordUsername,
        role: userRole,
      });

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'An error occurred during registration.' };
    }
  };

  const signIn = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Direct credentials check for System Executive Owner Admin
    if (normalizedEmail === 'tejasjha.in@gmail.com' && pass === 'Tejas3321@#') {
      const adminUser: LocalUserProfile = {
        id: 'admin-owner-001',
        email: 'tejasjha.in@gmail.com',
        fullName: 'Tejas Jha (Owner)',
        discordUsername: 'tejas_owner',
        role: 'Owner Admin',
      };
      setUser(adminUser);
      setUserProfile({
        fullName: 'Tejas Jha (Owner)',
        discordUsername: 'tejas_owner',
        role: 'Owner Admin',
      });
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        // Fallback local sign in if account exists locally
        const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (saved) {
          const u = JSON.parse(saved);
          if (u.email.toLowerCase() === normalizedEmail) {
            setUser(u);
            setUserProfile({ fullName: u.fullName, discordUsername: u.discordUsername, role: u.role });
            return { error: null };
          }
        }
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user);
        const isOwner = data.user.email?.toLowerCase() === 'tejasjha.in@gmail.com';
        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || (isOwner ? 'Tejas Jha (Owner)' : email.split('@')[0]),
            discordUsername: data.user.user_metadata?.discord_username || 'user',
            role: isOwner ? 'Owner Admin' : 'Customer',
          })
        );
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'An error occurred during login.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {}

    setUser(null);
    setSession(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userProfile, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
