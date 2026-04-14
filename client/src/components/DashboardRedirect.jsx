import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Ескі /dashboard сілтемелерін рөл бойынша бағыттау */
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "courier") return <Navigate to="/courier" replace />;
  return <Navigate to="/panel/orders" replace />;
};

export default DashboardRedirect;
