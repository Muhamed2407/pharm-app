import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PharmaciesMap from "../components/PharmaciesMap";
import AnimatedCounter from "../components/AnimatedCounter";
import { astanaPharmacies } from "../data/pharmacies";
import { contact } from "../data/contact";

const stats = [
  { label: "дәрі", end: 5000, suffix: "+" },
  { label: "клиент", end: 1200, suffix: "+" },
  { label: "қызмет", text: "24/7" },
  { label: "жеткізу", end: 15, suffix: " мин" },
];

const HomePage = () => (
  <main className="page-home">
    <section className="hero-section">
      <div className="hero-bg" aria-hidden />
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">Астана • онлайн дәріхана</p>
          <h1 className="hero-title">
            Дәрілерді үйден шықпай-ақ <span className="text-gradient">жеңілдікпен</span> алыңыз
          </h1>
          <p className="hero-lead">
            15–30 минут ішінде жеткізу. Каспи және банк картасы. Таза интерфейс, жылдам тапсырыс.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/catalog">
              Каталогты ашу
            </Link>
            <Link className="btn btn-ghost" to="/cart">
              Себетке өту
            </Link>
          </div>
          <p className="hero-note">Барлық бағаларда тұрақты жеңілдік белгісі көрсетіледі.</p>
          <p className="hero-phone">
            <span className="hero-phone-label">Қолдау:</span>{" "}
            <a className="hero-phone-link" href={`tel:${contact.phoneTel}`}>{contact.phoneDisplay}</a>
          </p>
        </motion.div>
        <motion.div
          className="hero-panel card-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <h2 className="panel-title">Бүгінгі артықшылықтар</h2>
          <ul className="panel-list">
            <li>Жеңілдікке арналған нақты баға</li>
            <li>Астана бойынша серіктес аптекалар</li>
            <li>Тапсырыс статусы мен жеткізу уақыты</li>
          </ul>
        </motion.div>
      </div>
    </section>

    <section className="container section">
      <div className="section-head">
        <h2 className="section-title">Сандар</h2>
        <p className="section-sub">Қысқа статистика — нақты сенім</p>
      </div>
      <div className="stats-grid">
        {stats.map((item) => (
          <motion.div
            key={item.label}
            className="stat-card"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 14 }}
            viewport={{ once: true }}
          >
            <div className="stat-value text-gradient">
              {item.text ? item.text : <AnimatedCounter end={item.end} suffix={item.suffix} />}
            </div>
            <p className="stat-label">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="container section pharmacies-section">
      <div className="section-head">
        <h2 className="section-title">Астана қаласындағы аптекалар</h2>
        <p className="section-sub">Картада серіктес пункттердің орналасуы көрсетілген</p>
      </div>
      <div className="pharmacies-layout">
        <div className="pharmacies-list card-elevated">
          <h3 className="list-title">Тізім</h3>
          <ul className="pharmacy-items">
            {astanaPharmacies.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <span>{p.address}</span>
              </li>
            ))}
          </ul>
        </div>
        <PharmaciesMap />
      </div>
      <article className="card-elevated pharmacy-photo-card">
        <img
          src="https://images.unsplash.com/photo-1576602976047-174e57a47881"
          alt="Дәріхана ішкі көрінісі"
          className="pharmacy-photo"
        />
        <div className="pharmacy-photo-caption">
          <h3>Серіктес дәріхана</h3>
          <p>Тауарлар тексерілген қоймадан жіберіледі, сондықтан сапасы тұрақты.</p>
        </div>
      </article>
    </section>

    <section className="container section contact-section" id="байланыс">
      <div className="section-head">
        <h2 className="section-title">Байланыс</h2>
        <p className="section-sub">Сұрақ болса, хабарласыңыз — жедел жауап береміз</p>
      </div>
      <div className="contact-cards">
        <a className="card-elevated contact-card" href={`tel:${contact.phoneTel}`}>
          <span className="contact-card-label">Телефон</span>
          <strong className="contact-card-value">{contact.phoneDisplay}</strong>
          <span className="contact-card-hint">Қоңырау шалу</span>
        </a>
        <a className="card-elevated contact-card" href={`mailto:${contact.email}`}>
          <span className="contact-card-label">Email</span>
          <strong className="contact-card-value">{contact.email}</strong>
          <span className="contact-card-hint">Хат жіберу</span>
        </a>
        <a className="card-elevated contact-card" href={contact.whatsappUrl} target="_blank" rel="noreferrer">
          <span className="contact-card-label">WhatsApp</span>
          <strong className="contact-card-value">Чат</strong>
          <span className="contact-card-hint">Жазу</span>
        </a>
      </div>
    </section>
  </main>
);

export default HomePage;
