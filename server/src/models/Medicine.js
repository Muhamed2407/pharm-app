const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    listPrice: { type: Number, min: 0 },
    onSale: { type: Boolean, default: false },
    image: { type: String, default: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800" },
    description: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
