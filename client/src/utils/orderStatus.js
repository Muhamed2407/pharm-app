export const orderStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Күтілуде";
    case "assigned":
      return "Курьер тағайындалды";
    case "delivering":
      return "Жолда";
    case "delivered":
      return "Жеткізілді";
    default:
      return status;
  }
};
