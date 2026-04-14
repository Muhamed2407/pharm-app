/** Байланыс — негізгі нөмір мен email. Қажет болса өзгертіңіз немесе .env (VITE_*) қолданыңыз */

const envPhone = typeof import.meta !== "undefined" ? import.meta.env?.VITE_CONTACT_PHONE : "";
const envEmail = typeof import.meta !== "undefined" ? import.meta.env?.VITE_CONTACT_EMAIL : "";

const toTelHref = (display) => {
  const digits = String(display).replace(/\D/g, "");
  if (!digits) return "+771725550000";
  if (digits.startsWith("8") && digits.length >= 10) return `+7${digits.slice(1)}`;
  if (digits.startsWith("7")) return `+${digits}`;
  return `+${digits}`;
};

const defaultDisplay = "+7 (7172) 555-00-00";

export const contact = {
  phoneDisplay: envPhone || defaultDisplay,
  get phoneTel() {
    return toTelHref(this.phoneDisplay);
  },
  email: envEmail || "info@pharmapp.kz",
  whatsappUrl: "https://wa.me/77001234567",
  address: "Қазақстан, Астана қаласы",
  hours: "Қолдау: 24/7",
};
