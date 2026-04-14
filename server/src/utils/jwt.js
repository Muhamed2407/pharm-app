const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

module.exports = { createToken };

