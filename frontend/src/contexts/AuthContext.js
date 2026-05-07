import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Start with null to avoid initial token check
  const [loading, setLoading] = useState(false); // Start with false since we're not checking on load

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setLoading(true);
      fetchUserData(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (authToken) => {
    try {
      const response = await fetch('http://localhost:8000/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } else {
        // Other errors
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear token on network errors too
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        await fetchUserData(data.access_token);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.detail };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (email, username, password) => {
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.detail };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
