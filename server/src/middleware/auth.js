const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Авторизация қажет" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Қолданушы табылмады" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Жарамсыз токен" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Тек әкімшіге рұқсат" });
  }
  next();
};

const courierOnly = (req, res, next) => {
  if (req.user?.role !== "courier") {
    return res.status(403).json({ message: "Тек курьерге рұқсат" });
  }
  next();
};

module.exports = { protect, adminOnly, courierOnly };
