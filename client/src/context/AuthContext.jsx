import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";
import { normalizeRole } from "../utils/roles";

const AuthContext = createContext(null);
const DEMO_USER_KEY = "pharm_demo_user";

const DEMO_USERS = [
  { email: "admin@pharmapp.kz", password: "admin123", fullName: "Админ PharmApp", role: "admin", id: "demo-admin" },
  { email: "courier@pharmapp.kz", password: "courier123", fullName: "Курьер Astana", role: "courier", id: "demo-courier" },
  { email: "user@pharmapp.kz", password: "user12345", fullName: "Клиент Demo", role: "client", id: "demo-client" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (raw) => (raw ? { ...raw, role: normalizeRole(raw.role) } : null);

  useEffect(() => {
    const demoRaw = localStorage.getItem(DEMO_USER_KEY);
    if (demoRaw) {
      setUser(JSON.parse(demoRaw));
      setLoading(false);
      return;
    }

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
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "").trim();
    try {
      const { data } = await api.post("/api/auth/login", { email: normalizedEmail, password: normalizedPassword });
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.setItem("pharm_token", data.token);
      const normalized = normalizeUser(data.user);
      setUser(normalized);
      return normalized;
    } catch {
      const demo = DEMO_USERS.find((entry) => entry.email === normalizedEmail && entry.password === normalizedPassword);
      if (!demo) throw new Error("login-failed");
      localStorage.removeItem("pharm_token");
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo));
      setUser(demo);
      return demo;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", { fullName, email, password });
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.setItem("pharm_token", data.token);
      const normalized = normalizeUser(data.user);
      setUser(normalized);
      return normalized;
    } catch {
      const localUser = {
        id: `demo-register-${Date.now()}`,
        email,
        fullName,
        role: "client",
      };
      localStorage.removeItem("pharm_token");
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(localUser));
      setUser(localUser);
      return localUser;
    }
  };

  const logout = () => {
    localStorage.removeItem("pharm_token");
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    try {
      const { data } = await api.patch("/api/users/me", payload);
      const normalized = normalizeUser(data);
      setUser(normalized);
      return normalized;
    } catch {
      const updated = { ...user, ...payload };
      setUser(updated);
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
      return updated;
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
