import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";
import { normalizeRole } from "../utils/roles";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (raw) => (raw ? { ...raw, role: normalizeRole(raw.role) } : null);

  useEffect(() => {
    const token = localStorage.getItem("pharm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/api/users/me")
      .then((res) => setUser(normalizeUser(res.data)))
      .catch(() => {
        localStorage.removeItem("pharm_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("pharm_token", data.token);
    const normalized = normalizeUser(data.user);
    setUser(normalized);
    return normalized;
  };

  const register = async (fullName, email, password) => {
    const { data } = await api.post("/api/auth/register", { fullName, email, password });
    localStorage.setItem("pharm_token", data.token);
    const normalized = normalizeUser(data.user);
    setUser(normalized);
    return normalized;
  };

  const logout = () => {
    localStorage.removeItem("pharm_token");
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/api/users/me", payload);
    const normalized = normalizeUser(data);
    setUser(normalized);
    return normalized;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
