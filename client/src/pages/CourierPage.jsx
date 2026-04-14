import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { orderStatusLabel } from "../utils/orderStatus";

const CourierPage = () => {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await api.get("/api/courier/orders");
    setOrders(data);
  }, []);

  useEffect(() => {
    load().catch(() => setMsg("Тапсырыстарды жүктеу мүмкін болмады"));
  }, [load]);

  const patchStatus = async (id, status) => {
    setMsg("");
    try {
      await api.patch(`/api/courier/orders/${id}`, { status });
      await load();
      setMsg(status === "delivered" ? "Жеткізілді деп белгіленді" : "Жолда статусы қойылды");
    } catch {
      setMsg("Статусты өзгерту мүмкін болмады");
    }
  };

  return (
    <main className="container section page-courier">
      <div className="section-head">
        <h1 className="section-title">Курьер панелі</h1>
        <p className="section-sub">Тағайындалған тапсырыстар — жолға шығу және жеткізу</p>
      </div>
      {msg && <p className="notice">{msg}</p>}
      {!orders.length ? (
        <div className="card-elevated empty-state">Қазір тағайындалған тапсырыс жоқ</div>
      ) : (
        orders.map((o) => (
          <article key={o._id} className="card-elevated courier-card">
            <div className="courier-card-head">
              <div>
                <p className="courier-meta">Тапсырыс № {o._id.slice(-6)}</p>
                <h2 className="courier-total">{o.total} тг</h2>
                <p className="courier-status">{orderStatusLabel(o.status)}</p>
              </div>
              <div className="courier-actions">
                {o.status === "assigned" && (
                  <button type="button" className="btn btn-primary" onClick={() => patchStatus(o._id, "delivering")}>
                    Жолға шықтым
                  </button>
                )}
                {(o.status === "assigned" || o.status === "delivering") && (
                  <button type="button" className="btn btn-ghost" onClick={() => patchStatus(o._id, "delivered")}>
                    Жеткіздім
                  </button>
                )}
              </div>
            </div>
            <div className="courier-details">
              <p><strong>Тұтынушы:</strong> {o.name}</p>
              <p><strong>Телефон:</strong> {o.phone}</p>
              <p><strong>Мекенжай:</strong> {o.address}</p>
              <p><strong>Төлем:</strong> {o.paymentMethod === "kaspi" ? "Kaspi" : "Карта"}</p>
            </div>
          </article>
        ))
      )}
    </main>
  );
};

export default CourierPage;
