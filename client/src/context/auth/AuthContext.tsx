import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  AuthContextValue,
  AuthCredentials,
  AuthProviderProps,
  AuthUser,
} from "../../types/auth";
import * as authApi from "../../api/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "blogweb_user";
const TOKEN_STORAGE_KEY = "blogweb_token";

const saveAuth = (user: AuthUser | null, token?: string | null) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  const login = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);

    try {
      const { token, user: loggedInUser } = await authApi.login(credentials);
      saveAuth(loggedInUser, token);
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);

    try {
      const { token, user: nextUser } = await authApi.signup(credentials);
      saveAuth(nextUser, token);
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    saveAuth(null, null);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!user && token) {
      setLoading(true);
      authApi
        .getCurrentUser()
        .then(({ user: currentUser }) => {
          setUser(currentUser);
          saveAuth(currentUser, token);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [logout, user]);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    signup,
    logout,
  };

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
