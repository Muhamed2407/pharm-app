import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { orderStatusLabel } from "../../utils/orderStatus";

const ClientOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/api/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="panel-section">
      <h2 className="panel-heading">Менің тапсырыстарым</h2>
      {!orders.length ? (
        <p className="muted">Әлі тапсырыс жоқ — <Link to="/catalog">каталогтан</Link> таңдаңыз.</p>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="order-card panel-order">
            <div className="order-row">
              <span className="order-sum">{order.totalAmount} ₸</span>
              <span className="order-pill">{orderStatusLabel(order.status)}</span>
            </div>
            {order.courier && (
              <p className="order-courier">
                Курьер: {order.courier.fullName}
                {order.courier.phone ? ` · ${order.courier.phone}` : ""}
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
