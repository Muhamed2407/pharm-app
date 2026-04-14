import { useEffect, useState } from "react";
import api from "../api";
import { orderStatusLabel } from "../utils/orderStatus";

const AdminPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", listPrice: "", image: "", onSale: true });
  const [assign, setAssign] = useState({});

  const load = async () => {
    const [m, o, c] = await Promise.all([
      api.get("/api/medicines"),
      api.get("/api/orders"),
      api.get("/api/couriers"),
    ]);
    setMedicines(m.data);
    setOrders(o.data);
    setCouriers(c.data);
  };

  useEffect(() => {
    load();
  }, []);

  const addMedicine = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), onSale: form.onSale };
    if (form.listPrice) payload.listPrice = Number(form.listPrice);
    if (!payload.onSale) delete payload.listPrice;
    await api.post("/api/medicines", payload);
    setForm({ name: "", price: "", listPrice: "", image: "", onSale: true });
    load();
  };

  const removeMedicine = async (id) => {
    await api.delete(`/api/medicines/${id}`);
    load();
  };

  const markDelivered = async (id) => {
    await api.put(`/api/orders/${id}/status`, { status: "delivered" });
    load();
  };

  const assignCourier = async (orderId) => {
    const courierId = assign[orderId];
    if (!courierId) return;
    await api.put(`/api/orders/${orderId}/assign`, { courierId });
    setAssign((prev) => ({ ...prev, [orderId]: "" }));
    load();
  };

  return (
    <main className="container section page-admin">
      <div className="section-head">
        <h1 className="section-title">Админ панель</h1>
        <p className="section-sub">Дәрілер, тапсырыстар және курьер тағайындау</p>
      </div>
      <form className="card-elevated form admin-form" onSubmit={addMedicine}>
        <h2 className="form-title">Жаңа дәрі</h2>
        <input className="input" placeholder="Дәрі атауы" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Бағасы" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <label className="check-row">
          <input type="checkbox" checked={form.onSale} onChange={(e) => setForm({ ...form, onSale: e.target.checked })} />
          Жеңілдікпен сату (listPrice қажет)
        </label>
        {form.onSale && (
          <input className="input" placeholder="Бұрынғы баға (list price)" value={form.listPrice} onChange={(e) => setForm({ ...form, listPrice: e.target.value })} />
        )}
        <input className="input" placeholder="Сурет URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button type="submit" className="btn btn-primary">Дәрі қосу</button>
      </form>

      <h2 className="dash-subtitle">Дәрілер</h2>
      {medicines.map((m) => (
        <article className="card-elevated cart-row" key={m._id}>
          <p>
            {m.name} — {m.price} тг
            {m.onSale && m.listPrice ? ` (бұрын: ${m.listPrice} тг)` : " (стандарт)"}
          </p>
          <button type="button" className="btn btn-ghost" onClick={() => removeMedicine(m._id)}>Өшіру</button>
        </article>
      ))}

      <h2 className="dash-subtitle">Тапсырыстар</h2>
      {orders.map((o) => (
        <article className="card-elevated admin-order" key={o._id}>
          <div className="admin-order-top">
            <div>
              <p className="courier-meta">№ {o._id.slice(-6)} · {o.name}</p>
              <p className="courier-total">{o.total} тг</p>
              <p>{orderStatusLabel(o.status)}</p>
              {o.courierId && <p className="order-courier">Курьер: {o.courierId.name}</p>}
            </div>
            <div className="admin-order-actions">
              {o.status === "pending" && (
                <>
                  <select
                    className="input courier-select"
                    value={assign[o._id] || ""}
                    onChange={(e) => setAssign((prev) => ({ ...prev, [o._id]: e.target.value }))}
                  >
                    <option value="">Курьер таңдау</option>
                    {couriers.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-primary" onClick={() => assignCourier(o._id)}>Тағайындау</button>
                </>
              )}
              {o.status !== "delivered" && (
                <button type="button" className="btn btn-ghost" onClick={() => markDelivered(o._id)}>Әкімші: аяқтау</button>
              )}
            </div>
          </div>
        </article>
      ))}
    </main>
  );
};

export default AdminPage;
