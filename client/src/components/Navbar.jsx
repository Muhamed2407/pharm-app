import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <div className="brand-wrap">
          <Link to="/" className="brand">Pharm App</Link>
          <span className="live-badge">LIVE NEW</span>
        </div>
        <div className="links">
          <NavLink to="/catalog">Каталог</NavLink>
          <Link to="/#байланыс">Байланыс</Link>
          <NavLink to="/cart">Себет ({items.length})</NavLink>
          {user ? (
            <>
              {user.role === "client" && <NavLink to="/panel/orders">Клиент панелі</NavLink>}
              {user.role === "admin" && <NavLink to="/admin">Админ</NavLink>}
              {user.role === "courier" && <NavLink to="/courier">Курьер</NavLink>}
              <button type="button" onClick={onLogout} className="link-button">Шығу</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Кіру</NavLink>
              <NavLink to="/register">Тіркелу</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
