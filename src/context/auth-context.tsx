"use client";

import { registerNewSession, validateSession } from "@/app/actions/auth";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoaded(true);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoaded(true);

      if (event === 'SIGNED_IN' && session?.user) {
        // Kick out all other sessions and register this one ONLY IF we haven't already
        const localId = localStorage.getItem('tm_session_id');
        
        if (!localId) {
          const newSessionId = await registerNewSession();
          if (newSessionId) {
            localStorage.setItem('tm_session_id', newSessionId);
          }
        }

        // Sync profile - ensure basic setup
        const { id, user_metadata } = session.user;
        await supabase
          .from('profiles')
          .upsert({
            id: id,
            full_name: (user_metadata?.full_name as string) || 'Generic User',
            updated_at: new Date().toISOString(),
          } as any);
      }

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('tm_session_id');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Periodic and Focus-based session validation
  useEffect(() => {
    if (!user) return;

    const checkCurrentSession = async () => {
      const localId = localStorage.getItem('tm_session_id');
      if (!localId) return;

      const { isValid } = await validateSession(localId);
      if (!isValid) {
        await signOut();
        window.location.href = "/login?error=session-conflict";
      }
    };

    // Check every 20 seconds
    const interval = setInterval(checkCurrentSession, 20000);
    
    // Check when user returns to this tab
    window.addEventListener('focus', checkCurrentSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkCurrentSession);
    };
  }, [user]);

  const signOut = async () => {
    localStorage.removeItem('tm_session_id');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
