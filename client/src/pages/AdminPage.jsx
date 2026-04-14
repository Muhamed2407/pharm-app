import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { orderStatusLabel } from "../utils/orderStatus";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    price: "",
    discountPrice: "",
    pharmacyId: "",
  });
  const [pharmacies, setPharmacies] = useState([]);

  const load = useCallback(async () => {
    const [productsRes, ordersRes, pharmaciesRes] = await Promise.all([
      api.get("/api/admin/products"),
      api.get("/api/admin/orders"),
      api.get("/api/pharmacies"),
    ]);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
    setPharmacies(pharmaciesRes.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProduct = async (e) => {
    e.preventDefault();
    await api.post("/api/admin/products", {
      name: form.name,
      description: form.description,
      category: form.category,
      imageUrl: form.imageUrl,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      pharmacyId: form.pharmacyId,
      inStock: true,
      isPromo: Boolean(form.discountPrice),
      isBestSeller: false,
    });
    setForm({
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      price: "",
      discountPrice: "",
      pharmacyId: pharmacies[0]?.id || "",
    });
    await load();
  };

  const removeProduct = async (id) => {
    await api.delete(`/api/admin/products/${id}`);
    await load();
  };

  return (
    <main className="container section page-admin">
      <div className="section-head">
        <h1 className="section-title">Админ панель</h1>
        <p className="section-sub">Дәрілерді басқару және тапсырыстар мониторингі</p>
      </div>

      <form className="card-elevated form admin-form" onSubmit={addProduct}>
        <h2 className="form-title">Жаңа дәрі</h2>
        <input className="input" placeholder="Дәрі атауы" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Сипаттама" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="input" placeholder="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input className="input" placeholder="Негізгі баға (₸)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input className="input" placeholder="Скидка бағасы (₸)" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
        <input className="input" placeholder="Сурет URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
        <select className="input" value={form.pharmacyId} onChange={(e) => setForm({ ...form, pharmacyId: e.target.value })} required>
          <option value="">Аптека таңдаңыз</option>
          {pharmacies.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Дәрі қосу</button>
      </form>

      <h2 className="dash-subtitle">Дәрілер</h2>
      {products.map((m) => (
        <article className="card-elevated cart-row" key={m.id}>
          <p>
            {m.name} — {m.discountPrice ?? m.price} ₸
            {m.discountPrice ? ` (бұрын: ${m.price} ₸)` : " (стандарт)"}
          </p>
          <button type="button" className="btn btn-ghost" onClick={() => removeProduct(m.id)}>Өшіру</button>
        </article>
      ))}

      <h2 className="dash-subtitle">Тапсырыстар</h2>
      {orders.map((o) => (
        <article className="card-elevated admin-order" key={o.id}>
          <div className="admin-order-top">
            <div>
              <p className="courier-meta">№ {o.id.slice(-6)} · {o.user?.fullName || "Клиент"}</p>
              <p className="courier-total">{o.totalAmount} ₸</p>
              <p>{orderStatusLabel(o.status)}</p>
              {o.courier && <p className="order-courier">Курьер: {o.courier.fullName}</p>}
            </div>
          </div>
        </article>
      ))}
    </main>
  );
};

export default AdminPage;
