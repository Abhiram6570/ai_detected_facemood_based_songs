import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Create UserContext
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from local storage (if available)
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData); // Set user state
    // localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
  };

  // const logout = () => {
  //   setUser(null); // Clear user state
  //   localStorage.removeItem('user'); // Remove user data from localStorage
  // };

  const logout = () => {
    // Clear user data from state
    setUser(null); // Clear user state
    localStorage.removeItem('user'); // Remove user data from localStorage
    
    // Clear cookies (non-HttpOnly cookies)
    console.log('[INFO] Clearing auth_token cookie...');
    document.cookie = 'auth_token=; Max-Age=0; path=/;';  // Clear the cookie by setting its Max-Age to 0
    
    // You can also clear other cookies the same way
    console.log('[INFO] Clearing other cookies...');
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; Max-Age=0; path=/;`;  // Expire each cookie
      console.log(`[INFO] Cleared cookie: ${cookieName}`);
    });
    
    // Optionally redirect to login page
    Navigate("/Login");
  };
  

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Access User Context
export const useUser = () => useContext(UserContext);
