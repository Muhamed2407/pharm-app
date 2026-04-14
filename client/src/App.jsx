import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import CourierPage from "./pages/CourierPage";
import ClientPanelLayout from "./pages/panel/ClientPanelLayout";
import ClientOrdersPage from "./pages/panel/ClientOrdersPage";
import ClientProfilePage from "./pages/panel/ClientProfilePage";
import Footer from "./components/Footer";

const routerBase =
  import.meta.env.BASE_URL === "/"
    ? "/"
    : import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <BrowserRouter basename={routerBase}>
      <Navbar />
      <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
        <Route path="/panel" element={<ProtectedRoute userOnly><ClientPanelLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<ClientOrdersPage />} />
          <Route path="profile" element={<ClientProfilePage />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
        <Route path="/courier" element={<ProtectedRoute courierOnly><CourierPage /></ProtectedRoute>} />
      </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
