import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useCart } from "../context/CartContext";
import MedicineCard from "../components/MedicineCard";

const CatalogPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/api/medicines")
      .then((res) => setMedicines(res.data))
      .catch(() => setError("Каталогты жүктеу мүмкін болмады"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return medicines.filter((m) => {
      if (!m.name.toLowerCase().includes(q)) return false;
      const isSale =
        m.onSale !== false &&
        m.listPrice &&
        m.listPrice > m.price;
      if (filter === "sale") return isSale;
      if (filter === "standard") return !isSale;
      return true;
    });
  }, [medicines, query, filter]);

  if (loading) return <p className="container section">Жүктелуде...</p>;
  if (error) return <p className="container section">{error}</p>;

  return (
    <main className="container section page-catalog">
      <div className="section-head">
        <h1 className="section-title">Дәрі каталогы</h1>
        <p className="section-sub">Жеңілдік және стандарт бағалар</p>
      </div>
      <div className="catalog-toolbar">
        <input
          className="input catalog-search"
          placeholder="Дәріні іздеу..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filter-pills" role="tablist" aria-label="Сүзгі">
          <button type="button" className={filter === "all" ? "pill active" : "pill"} onClick={() => setFilter("all")}>
            Барлығы
          </button>
          <button type="button" className={filter === "sale" ? "pill active" : "pill"} onClick={() => setFilter("sale")}>
            Жеңілдік
          </button>
          <button type="button" className={filter === "standard" ? "pill active" : "pill"} onClick={() => setFilter("standard")}>
            Стандарт
          </button>
        </div>
      </div>
      <div className="grid">
        {filtered.map((medicine) => (
          <MedicineCard key={medicine._id} medicine={medicine} onAdd={addToCart} />
        ))}
      </div>
    </main>
  );
};

export default CatalogPage;
