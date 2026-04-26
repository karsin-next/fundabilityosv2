"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const supabase = createClient();

  useEffect(() => {
    // 1. Get initial user
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoaded(true);
    };

    getInitialUser();

    // 2. Aggressive Catch for hash-based logins (Implicit Flow)
    // If we land on any page with #access_token, Supabase's client-side library 
    // will process it, but we need to force the redirect to dashboard.
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      console.log("[Auth] Token detected in hash, waiting for session...");
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log("[Auth] Session found, forcing dashboard redirect");
          window.location.href = "/dashboard";
        }
      });
    }

    // 3. Listen for auth changes and sync cookies
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth Change Event]:", event);
      setUser(session?.user ?? null);
      setIsLoaded(true);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Sync cookies for middleware
        await fetch("/api/auth/callback?sync=true");
        
        // If we are on the login page or have a hash, go to dashboard
        if (window.location.pathname === "/login" || window.location.hash) {
          window.location.href = "/dashboard";
        }
      }

      if (event === "SIGNED_OUT") {
        window.location.href = "/";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
}
