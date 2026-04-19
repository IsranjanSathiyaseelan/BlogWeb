import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthCredentials = {
  email: string;
  password: string;
  name?: string;
};

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "blogweb_user";

const createDemoUser = (email: string, name?: string): AuthUser => ({
  id: crypto.randomUUID?.() ?? `${Date.now()}`,
  name: name?.trim() || "Demo User",
  email: email.trim().toLowerCase(),
});

const delay = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AuthUser;
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const saveUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);

    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const login = useCallback(async ({ email }: AuthCredentials) => {
    setLoading(true);
    await delay(600);

    const nextUser = createDemoUser(email);
    saveUser(nextUser);
    setLoading(false);
  }, []);

  const signup = useCallback(async ({ email, name }: AuthCredentials) => {
    setLoading(true);
    await delay(700);

    const nextUser = createDemoUser(email, name);
    saveUser(nextUser);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    saveUser(null);
  }, []);

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
