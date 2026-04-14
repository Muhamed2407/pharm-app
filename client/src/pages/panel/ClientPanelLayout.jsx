import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ClientPanelLayout = () => {
  const { user } = useAuth();

  return (
    <div className="panel-shell container section">
      <div className="panel-header">
        <h1 className="section-title">Клиент панелі</h1>
        <p className="section-sub">Сәлем, {user?.name} — тапсырыстарыңыз бен профиліңіз</p>
      </div>
      <div className="panel-grid">
        <aside className="panel-sidebar card-elevated">
          <nav className="panel-nav" aria-label="Клиент мәзірі">
            <NavLink to="/panel/orders" className={({ isActive }) => (isActive ? "panel-link active" : "panel-link")}>
              Тапсырыстар
            </NavLink>
            <NavLink to="/panel/profile" className={({ isActive }) => (isActive ? "panel-link active" : "panel-link")}>
              Профиль
            </NavLink>
          </nav>
        </aside>
        <div className="panel-main card-elevated">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientPanelLayout;
