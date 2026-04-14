const jwt = require("jsonwebtoken");

const auth = (roles = []) => (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Токен жоқ" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;

    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ message: "Құқық жеткіліксіз" });
    }

    return next();
  } catch {
    return res.status(401).json({ message: "Жарамсыз токен" });
  }
};

module.exports = { auth };
