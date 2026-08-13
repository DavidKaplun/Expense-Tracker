import { createContext, useContext, useState, type ReactNode } from 'react';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'auth_user_id';

interface AuthContextValue {
  /** Bearer token for API calls, or null when signed out. */
  token: string | null;
  userId: number | null;
  login: (token: string, userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Reads a key from localStorage.
 *
 * Wrapped in try/catch because localStorage throws rather than returning null
 * when storage is unavailable — private browsing, disabled cookies, or a
 * non-web runtime.
 */
function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStored(TOKEN_KEY));

  const [userId, setUserId] = useState<number | null>(() => {
    const stored = readStored(USER_ID_KEY);
    if (stored === null) return null;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  });

  const login = (token: string, userId: number) => {
    setToken(token);
    setUserId(userId);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_ID_KEY, String(userId));
    } catch {
      // Session still works in memory; it just will not survive a reload.
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
    } catch {
      // Nothing to clean up if storage was never available.
    }
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Returns the auth context, throwing if no provider is mounted above.
 *
 * The throw is what lets the return type be non-nullable, so callers can
 * destructure without a null check. The alternative — returning null and
 * making every caller guard — would add a check to nine screens for a
 * condition that only a wiring mistake could ever produce.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
