import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthProfile {
  id: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
}

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "disabled";

interface AuthContextValue {
  session: Session | null;
  profile: AuthProfile | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const mounted = useRef(true);

  const loadProfile = useCallback(async (current: Session | null) => {
    if (!current) {
      if (!mounted.current) return;
      setProfile(null);
      setStatus((prev) => (prev === "disabled" ? "disabled" : "unauthenticated"));
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("id", current.user.id)
      .single();

    if (!mounted.current) return;

    if (error || !data || data.is_active === false) {
      setProfile(null);
      setStatus("disabled");
      await supabase.auth.signOut();
      return;
    }

    setProfile(data as AuthProfile);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    mounted.current = true;

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        void loadProfile(nextSession);
      },
    );

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted.current) return;
      setSession(data.session);
      void loadProfile(data.session);
    });

    return () => {
      mounted.current = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("unauthenticated");
      return { error: "Email ou mot de passe incorrect" };
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (!mounted.current) return;
    setSession(null);
    setProfile(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ session, profile, status, signIn, signOut }),
    [session, profile, status, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}