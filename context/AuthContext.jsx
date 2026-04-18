import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'auth_user_id';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_KEY) || null; } catch { return null; }
  });
  const [userId, setUserId] = useState(() => {
    try { return localStorage.getItem(USER_ID_KEY) || null; } catch { return null; }
  });

  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_ID_KEY, userId);
    } catch {}
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
