import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", paymentMethod: "kaspi" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      paymentMethod: form.paymentMethod === "kaspi" ? "Kaspi" : "Card",
      deliveryAddr: form.address,
    };
    const { data: order } = await api.post("/api/orders/checkout", payload);
    await api.post(`/api/payments/${order.id}/simulate`);
    clearCart();
    setMsg("Тапсырыс қабылданды, курьерге берілді");
    setTimeout(() => navigate("/panel/orders"), 1200);
  };

  return (
    <main className="container">
      <h1>Төлем және жеткізу</h1>
      <p>15–30 минут ішінде жеткізу</p>
      <form className="card form" onSubmit={submit}>
        <input className="input" placeholder="Аты-жөні" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="input" placeholder="Мекенжай" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <select className="input" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
          <option value="kaspi">Kaspi</option>
          <option value="card">Карта</option>
        </select>
        <button type="submit">Төлеу ({total} ₸)</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
};

export default CheckoutPage;
