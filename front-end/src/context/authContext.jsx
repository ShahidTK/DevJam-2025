// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Log in function
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
  };

  // Log out function
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user'); // Clear user from localStorage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
