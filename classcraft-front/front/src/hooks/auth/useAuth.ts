import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  email: string;
  role?: string;
  approved?: boolean;
  groupeId?: number | null;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  const login = useCallback((newToken: string, newUser?: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback((): boolean => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
      return true;
    }
    setIsAuthenticated(false);
    setToken(null);
    return false;
  }, []);

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    checkAuth,
  };
};

