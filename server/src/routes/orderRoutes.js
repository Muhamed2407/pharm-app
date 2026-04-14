const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ message: "Тапсырыс қабылданды", order });
  } catch (error) {
    res.status(400).json({ message: "Тапсырыс жасау қатесі" });
  }
});

router.get("/", protect, async (req, res) => {
  let query = {};
  if (req.user.role === "admin") query = {};
  else if (req.user.role === "courier") query = { courierId: req.user._id };
  else query = { userId: req.user._id };

  const orders = await Order.find(query)
    .populate("courierId", "name email phone")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  const { courierId } = req.body;
  if (!courierId) return res.status(400).json({ message: "Курьер таңдаңыз" });

  const courier = await User.findById(courierId);
  if (!courier || courier.role !== "courier") {
    return res.status(400).json({ message: "Курьер табылмады" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Тапсырыс табылмады" });
  if (order.status === "delivered") return res.status(400).json({ message: "Тапсырыс аяқталған" });

  order.courierId = courierId;
  order.status = "assigned";
  await order.save();

  const populated = await Order.findById(order._id).populate("courierId", "name email phone");
  res.json(populated);
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!["pending", "assigned", "delivering", "delivered"].includes(status)) {
    return res.status(400).json({ message: "Қате статус" });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Тапсырыс табылмады" });
  res.json(order);
});

module.exports = router;
