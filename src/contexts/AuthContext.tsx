import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { signIn } from "../api/auth/singin";
import { getSession } from "../api/auth/getSession";
import { singout } from "../api/auth/singout";
import { getRole } from "../api/auth/getRole";
import { supabase } from "../api/conection";
import { SESSION_MAX_AGE_SECONDS } from "../api/cookieStorage";

const SESSION_EXPIRES_KEY = "auth_session_expires_at";
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;
const PUBLIC_PATHS = ["/login", "/reset-password", "/accept-invite"];

const redirectToLogin = () => {
  if (!PUBLIC_PATHS.includes(window.location.pathname)) {
    window.location.replace("/login");
  }
};

const setSessionExpiry = () => {
  localStorage.setItem(SESSION_EXPIRES_KEY, String(Date.now() + SESSION_MAX_AGE_MS));
};

const clearSessionExpiry = () => {
  localStorage.removeItem(SESSION_EXPIRES_KEY);
};

// Expiración absoluta: si existe una sesión de Supabase pero no hay marca,
// se considera expirada (fail-closed) para forzar un nuevo login.
const isSessionExpired = (): boolean => {
  const raw = localStorage.getItem(SESSION_EXPIRES_KEY);
  if (!raw) return true;
  return Date.now() >= Number(raw);
};
interface User {
  token: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const withTimeout = async <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  };

  const fetchRole = async (): Promise<string> => {
    try {
      const { data, error } = await withTimeout(getRole(), 3000, { data: "", error: null });
      if (error) return "";
      if (typeof data === "string") return data;
      return "";
    } catch {
      return "";
    }
  };

  const logout = async () => {
    clearSessionExpiry();
    setUser(null);
    await withTimeout(singout(), 3000, { error: null });
  };

  const handleSessionExpired = useCallback(async () => {
    clearSessionExpiry();
    setUser(null);
    await withTimeout(singout(), 3000, { error: null });
    redirectToLogin();
  }, []);

  // Cargar sesión al montar
  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { data, error } = await getSession();

      if (error || !data.session) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Hay sesión de Supabase: validar la expiración absoluta antes de aceptarla.
      if (isSessionExpired()) {
        await handleSessionExpired();
        setIsLoading(false);
        return;
      }

      const sessionUser = data.session.user;
      const role = await fetchRole();
      const userData = {
        token: data.session.access_token,
        email: sessionUser.email ?? "",
        name: sessionUser.user_metadata?.name ?? sessionUser.user_metadata?.full_name ?? "",
        role,
      };

      setUser(userData);
      setIsLoading(false);
    })();
  }, [handleSessionExpired]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        void handleSessionExpired();
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [handleSessionExpired]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        clearSessionExpiry();
        setUser(null);
        redirectToLogin();
        return;
      }

      if (!session) return;

      if (event === "SIGNED_IN") {
        // Login real (password, OAuth, magic link): arranca el contador absoluto.
        setSessionExpiry();
      } else if (isSessionExpired()) {
        // Sesión previa (INITIAL_SESSION / TOKEN_REFRESHED) que ya superó las 8h.
        await handleSessionExpired();
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        setUser((prev) => {
          if (!prev) return prev;
          return { ...prev, token: session.access_token };
        });
        return;
      }

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        const sessionUser = session.user;
        const fetchedRole = await fetchRole();

        setUser((prev) => {
          const role = fetchedRole || prev?.role || "";
          return {
            token: session.access_token,
            email: sessionUser.email ?? "",
            name: sessionUser.user_metadata?.name ?? sessionUser.user_metadata?.full_name ?? "",
            role,
          };
        });
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [handleSessionExpired]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular delay de API
    // await new Promise((resolve) => setTimeout(resolve, 800));

    const { data, error } = await signIn(email, password);

    if (error) return false;

    const role = await fetchRole();
    const userData = {
      token: data.session?.access_token ?? "",
      email: data.user?.email ?? "",
      name: data.user?.user_metadata?.name ?? data.user?.user_metadata?.full_name ?? "",
      role,
    };

    setSessionExpiry();
    setUser(userData);
    return true;

  //   if (
  //     email === TEST_CREDENTIALS.email &&
  //     password === TEST_CREDENTIALS.password
  //   ) {
  //     const userData = {
  //       email: TEST_CREDENTIALS.email,
  //       name: TEST_CREDENTIALS.name,
  //     };
  //     setUser(userData);
  //     localStorage.setItem("user", JSON.stringify(userData));
  //     return true;
  //   }

  //   return false;
  // };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
