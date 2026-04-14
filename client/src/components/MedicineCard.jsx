import { motion } from "framer-motion";

const MedicineCard = ({ medicine, onAdd }) => {
  const hasDiscount =
    medicine.onSale !== false && medicine.listPrice && medicine.listPrice > medicine.price;
  const pct = hasDiscount
    ? Math.max(1, Math.round((1 - medicine.price / medicine.listPrice) * 100))
    : null;

  return (
    <motion.article className="medicine-card" whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 420, damping: 28 }}>
      <div className="card-media">
        <img src={medicine.image} alt={medicine.name} className="card-img" />
        {hasDiscount && pct && <span className="discount-badge">−{pct}%</span>}
        {!hasDiscount && <span className="standard-badge">Стандарт баға</span>}
      </div>
      <h3 className="card-title">{medicine.name}</h3>
      <div className="card-price-row">
        {hasDiscount && <span className="price-old">{medicine.listPrice} тг</span>}
        <span className="price-now">{medicine.price} тг</span>
      </div>
      <button type="button" className="btn-secondary" onClick={() => onAdd(medicine)}>
        Себетке қосу
      </button>
    </motion.article>
  );
};

export default MedicineCard;
