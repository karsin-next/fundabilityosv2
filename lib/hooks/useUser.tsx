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
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      console.log("[Auth] Token detected in hash, executing manual session set...");
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        // Force the session directly
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ data, error }) => {
          if (!error && data.session) {
            console.log("[Auth] Manual session set successful. Redirecting...");
            // Sync cookies for middleware before redirecting
            fetch("/api/auth/callback?sync=true").then(() => {
              window.location.href = "/dashboard";
            });
          }
        });
      }
    }

    // 3. Listen for auth changes and sync cookies
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth Change Event]:", event);
      setUser(session?.user ?? null);
      setIsLoaded(true);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Sync cookies for middleware
        await fetch("/api/auth/callback?sync=true");
        
        // If we are on the login page, go to dashboard
        if (window.location.pathname === "/login") {
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
