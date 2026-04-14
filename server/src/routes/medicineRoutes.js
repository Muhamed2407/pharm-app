const express = require("express");
const Medicine = require("../models/Medicine");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const medicines = await Medicine.find().sort({ createdAt: -1 });
  res.json(medicines);
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: "Дәрі қосу қатесі" });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!medicine) return res.status(404).json({ message: "Дәрі табылмады" });
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: "Дәрі жаңарту қатесі" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const medicine = await Medicine.findByIdAndDelete(req.params.id);
  if (!medicine) return res.status(404).json({ message: "Дәрі табылмады" });
  res.json({ message: "Дәрі өшірілді" });
});

module.exports = router;
