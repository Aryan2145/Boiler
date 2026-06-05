"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { AuthResponse, Session } from "@/lib/types";

type ContractorSignupInput = {
  fullName: string;
  licenseNo: string;
  companyName: string;
  companyAddress: string;
  telephone: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  session: Session | null;
  /** True while the stored token is being validated on first load. */
  loading: boolean;
  signupContractor: (input: ContractorSignupInput) => Promise<Session>;
  loginContractor: (email: string, password: string) => Promise<Session>;
  loginGovt: (email: string, password: string) => Promise<Session>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from a stored JWT on first load.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api<Session>("/auth/me")
      .then(setSession)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const applyAuth = useCallback((res: AuthResponse): Session => {
    setToken(res.accessToken);
    const next: Session =
      res.type === "contractor"
        ? { type: "contractor", user: res.user }
        : { type: "govt", user: res.user };
    setSession(next);
    return next;
  }, []);

  const signupContractor = useCallback(
    async (input: ContractorSignupInput) =>
      applyAuth(
        await api<AuthResponse>("/auth/contractor/signup", {
          method: "POST",
          body: input,
        }),
      ),
    [applyAuth],
  );

  const loginContractor = useCallback(
    async (email: string, password: string) =>
      applyAuth(
        await api<AuthResponse>("/auth/contractor/login", {
          method: "POST",
          body: { email, password },
        }),
      ),
    [applyAuth],
  );

  const loginGovt = useCallback(
    async (email: string, password: string) =>
      applyAuth(
        await api<AuthResponse>("/auth/govt/login", {
          method: "POST",
          body: { email, password },
        }),
      ),
    [applyAuth],
  );

  const logout = useCallback(() => {
    setToken(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signupContractor,
        loginContractor,
        loginGovt,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
