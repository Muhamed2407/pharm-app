import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useCart } from "../context/CartContext";
import MedicineCard from "../components/MedicineCard";
import { demoProducts } from "../data/demoProducts";

const CatalogPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/api/products")
      .then((res) => setMedicines(res.data))
      .catch(() => {
        setMedicines(demoProducts);
        setError("Сервер уақытша қолжетімсіз, демо каталог көрсетілді");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const values = [...new Set(medicines.map((m) => m.category).filter(Boolean))];
    return ["all", ...values];
  }, [medicines]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return medicines.filter((m) => {
      if (!m.name.toLowerCase().includes(q)) return false;
      if (category !== "all" && m.category !== category) return false;
      const activePrice = m.discountPrice ?? m.price;
      if (maxPrice && activePrice > Number(maxPrice)) return false;
      const isSale =
        m.discountPrice != null &&
        m.discountPrice < m.price;
      if (filter === "sale") return isSale;
      if (filter === "standard") return !isSale;
      return true;
    });
  }, [medicines, query, filter, category, maxPrice]);

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
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "Барлық категория" : item}
            </option>
          ))}
        </select>
        <input
          className="input catalog-search"
          placeholder="Макс баға (₸)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div className="grid">
        {filtered.map((medicine) => (
          <MedicineCard key={medicine.id} medicine={medicine} onAdd={addToCart} />
        ))}
      </div>
    </main>
  );
};

export default CatalogPage;
