const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Барлық өрістер міндетті" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email бұрын тіркелген" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      token: signToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Тіркелу кезінде қате" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email немесе құпиясөз қате" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Email немесе құпиясөз қате" });

    return res.json({
      token: signToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Кіру кезінде қате" });
  }
});

router.get("/profile", protect, async (req, res) => {
  return res.json(formatUser(req.user));
});

router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Қолданушы табылмады" });

    if (typeof name === "string" && name.trim()) user.name = name.trim();
    if (typeof phone === "string") user.phone = phone.trim();

    await user.save();
    return res.json(formatUser(user));
  } catch (error) {
    return res.status(400).json({ message: "Профильді жаңарту қатесі" });
  }
});

module.exports = router;
