const express = require("express");
const Order = require("../models/Order");
const { protect, courierOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, courierOnly);

router.get("/orders", async (req, res) => {
  const orders = await Order.find({ courierId: req.user._id })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["delivering", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Қате статус" });
    }

    const order = await Order.findOne({ _id: req.params.id, courierId: req.user._id });
    if (!order) return res.status(404).json({ message: "Тапсырыс табылмады" });

    if (status === "delivering" && order.status !== "assigned") {
      return res.status(400).json({ message: "Жолға шығу мүмкін емес" });
    }
    if (status === "delivered" && !["assigned", "delivering"].includes(order.status)) {
      return res.status(400).json({ message: "Жеткізу мүмкін емес" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Жаңарту қатесі" });
  }
});

module.exports = router;
