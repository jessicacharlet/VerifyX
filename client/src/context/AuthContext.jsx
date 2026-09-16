import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const AuthContext = createContext();

const normalizeUser = (userData) => {
  if (!userData || typeof userData !== "object") return null;
  const target = userData.user && typeof userData.user === "object" ? userData.user : userData;
  return {
    id: String(target.id || target._id || ""),
    name: typeof target.name === "string" ? target.name : (target.email ? String(target.email) : "Authorized User"),
    email: typeof target.email === "string" ? target.email : "",
    role: typeof target.role === "string" ? target.role.toLowerCase() : "user",
    companyName: typeof target.companyName === "string" ? target.companyName : "",
    walletAddress: typeof target.walletAddress === "string" ? target.walletAddress : "",
    createdAt: target.createdAt || null,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("verifyx_user");
      return savedUser ? normalizeUser(JSON.parse(savedUser)) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("verifyx_token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session on initial mount only
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("verifyx_token");
      if (savedToken) {
        try {
          const res = await API.get("/auth/me");
          if (res.data && res.data.success && res.data.user) {
            const cleanUser = normalizeUser(res.data.user);
            setUser(cleanUser);
            localStorage.setItem("verifyx_user", JSON.stringify(cleanUser));
          }
        } catch (error) {
          console.warn("Session check warning:", error?.response?.status || error.message);
          if (error.response?.status === 401) {
            // Token is explicitly rejected as invalid/expired
            logout();
          }
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data && res.data.success && res.data.token) {
      const newToken = res.data.token;
      const cleanUser = normalizeUser(res.data.user);

      localStorage.setItem("verifyx_token", newToken);
      localStorage.setItem("verifyx_user", JSON.stringify(cleanUser));

      setToken(newToken);
      setUser(cleanUser);
      setLoading(false);
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);
    if (res.data && res.data.success && res.data.token) {
      const newToken = res.data.token;
      const cleanUser = normalizeUser(res.data.user);

      localStorage.setItem("verifyx_token", newToken);
      localStorage.setItem("verifyx_user", JSON.stringify(cleanUser));

      setToken(newToken);
      setUser(cleanUser);
      setLoading(false);
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("verifyx_token");
    localStorage.removeItem("verifyx_user");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
