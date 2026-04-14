import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, courierOnly = false, userOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="container section">Жүктелуде...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") {
    if (user.role === "courier") return <Navigate to="/courier" replace />;
    return <Navigate to="/panel/orders" replace />;
  }
  if (courierOnly && user.role !== "courier") {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/panel/orders" replace />;
  }
  if (userOnly && user.role !== "client") {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "courier") return <Navigate to="/courier" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
