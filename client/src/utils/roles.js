export const normalizeRole = (role) => {
  const value = String(role || "").toUpperCase();
  if (value === "ADMIN") return "admin";
  if (value === "COURIER") return "courier";
  return "client";
};

