// context/authcontext.jsx
import { createContext, useState, useEffect } from "react";
import { setAuthToken, clearTokens } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("access");
      const savedUser = localStorage.getItem("user");
      
      console.log("Loading user from localStorage:", savedUser);
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        setAuthToken(token);
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("access", token);
      setAuthToken(token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};