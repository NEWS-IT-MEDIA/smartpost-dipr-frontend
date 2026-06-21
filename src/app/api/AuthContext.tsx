import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { signIn as apiSignIn, signOut as apiSignOut } from "./endpoints";
import { tokenStore } from "./client";
import { STORAGE } from "./config";
import type { UserInfo } from "./types";

type AuthState = {
  user: UserInfo | null;
  isAuthed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount (survives refresh).
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE.user);
    if (raw && tokenStore.access) {
      try {
        setUser(JSON.parse(raw) as UserInfo);
      } catch {
        tokenStore.clear();
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await apiSignIn(email, password);
    tokenStore.set(res.access_token, res.refresh_token, res.user.tenant_id ?? undefined);
    localStorage.setItem(STORAGE.user, JSON.stringify(res.user));
    setUser(res.user);
  };

  const signOut = () => {
    apiSignOut().catch(() => {});
    tokenStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthed: !!user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
