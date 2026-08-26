import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("verifyx_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("verifyx_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      if (token) {
        try {
          const res = await API.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem("verifyx_user", JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("verifyx_token", res.data.token);
      localStorage.setItem("verifyx_user", JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("verifyx_token", res.data.token);
      localStorage.setItem("verifyx_user", JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("verifyx_token");
    localStorage.removeItem("verifyx_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
