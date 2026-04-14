import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, updateQty, removeFromCart, total } = useCart();

  return (
    <main className="container">
      <h1>Себет</h1>
      {!items.length ? <p>Себет бос</p> : items.map((item) => (
        <article className="card cart-row" key={item._id}>
          <div>
            <strong>{item.name}</strong>
            <p>{item.price} тг</p>
          </div>
          <input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(item._id, Number(e.target.value))} />
          <button onClick={() => removeFromCart(item._id)}>Өшіру</button>
        </article>
      ))}
      <h2>Жалпы: {total} тг</h2>
      {items.length > 0 && <Link to="/checkout" className="btn">Төлемге өту</Link>}
    </main>
  );
};

export default CartPage;
