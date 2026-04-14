const express = require("express");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/couriers", protect, adminOnly, async (req, res) => {
  const couriers = await User.find({ role: "courier" }).select("name email _id").sort({ name: 1 });
  res.json(couriers);
});

module.exports = router;
