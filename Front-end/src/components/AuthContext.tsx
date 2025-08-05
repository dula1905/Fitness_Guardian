import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  // add other user fields if needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setUser: () => {
    // no-op default implementation
  },
  setToken: (_token: string | null) => {
    // no-op default implementation
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    setToken(storedToken);
    setUser(storedToken && storedName ? { name: storedName } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};