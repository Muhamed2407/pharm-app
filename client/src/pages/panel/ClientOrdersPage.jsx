import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { orderStatusLabel } from "../../utils/orderStatus";

const ClientOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/api/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="panel-section">
      <h2 className="panel-heading">Менің тапсырыстарым</h2>
      {!orders.length ? (
        <p className="muted">Әлі тапсырыс жоқ — <Link to="/catalog">каталогтан</Link> таңдаңыз.</p>
      ) : (
        orders.map((order) => (
          <article key={order._id} className="order-card panel-order">
            <div className="order-row">
              <span className="order-sum">{order.total} тг</span>
              <span className="order-pill">{orderStatusLabel(order.status)}</span>
            </div>
            {order.courierId && (
              <p className="order-courier">
                Курьер: {order.courierId.name}
                {order.courierId.phone ? ` · ${order.courierId.phone}` : ""}
              </p>
            )}
            <p className="order-hint">15–30 минут ішінде жеткізу (курьер тағайындалғанда)</p>
          </article>
        ))
      )}
    </div>
  );
};

export default ClientOrdersPage;
