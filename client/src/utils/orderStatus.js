export const orderStatusLabel = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "PENDING":
      return "Күтілуде";
    case "DELIVERING":
      return "Жолда";
    case "DELIVERED":
      return "Жеткізілді";
    default:
      return status;
  }
};
