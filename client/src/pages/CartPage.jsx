import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, updateQty, removeFromCart, total } = useCart();

  return (
    <main className="container">
      <h1>Себет</h1>
      {!items.length ? <p>Себет бос</p> : items.map((item) => (
        <article className="card cart-row" key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <p>{item.discountPrice ?? item.price} ₸</p>
          </div>
          <input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(item.id, Number(e.target.value))} />
          <button onClick={() => removeFromCart(item.id)}>Өшіру</button>
        </article>
      ))}
      <h2>Жалпы: {total} ₸</h2>
      {items.length > 0 && <Link to="/checkout" className="btn">Төлемге өту</Link>}
    </main>
  );
};

export default CartPage;
