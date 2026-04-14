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
      setMsg(status === "DELIVERED" ? "Жеткізілді деп белгіленді" : "Жолда статусы қойылды");
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
          <article key={o.id} className="card-elevated courier-card">
            <div className="courier-card-head">
              <div>
                <p className="courier-meta">Тапсырыс № {o.id.slice(-6)}</p>
                <h2 className="courier-total">{o.totalAmount} ₸</h2>
                <p className="courier-status">{orderStatusLabel(o.status)}</p>
              </div>
              <div className="courier-actions">
                {o.status === "PENDING" && (
                  <button type="button" className="btn btn-primary" onClick={() => patchStatus(o.id, "DELIVERING")}>
                    Жолға шықтым
                  </button>
                )}
                {(o.status === "PENDING" || o.status === "DELIVERING") && (
                  <button type="button" className="btn btn-ghost" onClick={() => patchStatus(o.id, "DELIVERED")}>
                    Жеткіздім
                  </button>
                )}
              </div>
            </div>
            <div className="courier-details">
              <p><strong>Тұтынушы:</strong> {o.user?.fullName || "—"}</p>
              <p><strong>Мекенжай:</strong> {o.deliveryAddr}</p>
              <p><strong>Төлем:</strong> {o.paymentMethod}</p>
            </div>
          </article>
        ))
      )}
    </main>
  );
};

export default CourierPage;
