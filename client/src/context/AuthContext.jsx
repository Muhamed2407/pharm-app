import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("pharm_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/api/profile")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("pharm_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/login", { email, password });
    localStorage.setItem("pharm_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/register", { name, email, password });
    localStorage.setItem("pharm_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("pharm_token");
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/api/profile", payload);
    setUser(data);
    return data;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
