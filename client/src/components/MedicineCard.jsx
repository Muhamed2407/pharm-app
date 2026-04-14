import { motion } from "framer-motion";

const MedicineCard = ({ medicine, onAdd }) => {
  const hasDiscount =
    medicine.discountPrice != null && medicine.discountPrice < medicine.price;
  const pct = hasDiscount
    ? Math.max(1, Math.round((1 - medicine.discountPrice / medicine.price) * 100))
    : null;
  const activePrice = hasDiscount ? medicine.discountPrice : medicine.price;

  return (
    <motion.article className="medicine-card" whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 420, damping: 28 }}>
      <div className="card-media">
        <img src={medicine.imageUrl} alt={medicine.name} className="card-img" />
        {hasDiscount && pct && <span className="discount-badge">−{pct}%</span>}
        {!hasDiscount && <span className="standard-badge">Стандарт баға</span>}
      </div>
      <h3 className="card-title">{medicine.name}</h3>
      <div className="card-price-row">
        {hasDiscount && <span className="price-old">{medicine.price} ₸</span>}
        <span className="price-now">{activePrice} ₸</span>
      </div>
      <button type="button" className="btn-secondary" onClick={() => onAdd(medicine)}>
        Себетке қосу
      </button>
    </motion.article>
  );
};

export default MedicineCard;
