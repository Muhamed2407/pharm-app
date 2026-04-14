import { Link } from "react-router-dom";
import { contact } from "../data/contact";

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <strong className="footer-logo">Pharm App</strong>
        <p className="footer-tagline">Астанаға онлайн дәріхана — жылдам жеткізу</p>
      </div>
      <div className="footer-contact">
        <h2 className="footer-heading">Байланыс</h2>
        <p>
          <span className="footer-label">Телефон</span>
          <a className="footer-link" href={`tel:${contact.phoneTel}`}>{contact.phoneDisplay}</a>
        </p>
        <p>
          <span className="footer-label">Email</span>
          <a className="footer-link" href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <p>
          <span className="footer-label">WhatsApp</span>
          <a className="footer-link" href={contact.whatsappUrl} target="_blank" rel="noreferrer">
            Жазу
          </a>
        </p>
        <p className="footer-meta">{contact.address}</p>
        <p className="footer-meta">{contact.hours}</p>
      </div>
      <div className="footer-nav">
        <h2 className="footer-heading">Навигация</h2>
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Себет</Link>
        <Link to="/login">Кіру</Link>
        <Link to="/register">Тіркелу</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>© {new Date().getFullYear()} Pharm App. Барлық құқықтар қорғалған.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
