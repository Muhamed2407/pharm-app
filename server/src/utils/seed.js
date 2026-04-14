const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Medicine = require("../models/Medicine");

const categories = [
  "Парацетамол",
  "Ибупрофен",
  "Аспирин",
  "Нурофен",
  "Амоксициллин",
  "Азитромицин",
  "Витамин C",
  "Витамин D",
  "Омега-3",
  "Смекта",
  "Линекс",
  "Но-шпа",
  "Терафлю",
  "Колдрекс",
  "Эссенциале",
  "Фестал",
  "Панкреатин",
  "Цитрамон",
  "Супрастин",
  "Зиртек",
];

const forms = ["таблетка", "капсула", "сироп", "спрей", "гель"];
const doses = ["100мг", "200мг", "250мг", "500мг", "750мг"];
const brands = ["Bio", "Pharm", "Plus", "Ultra", "Neo"];
const packSizes = [10, 20, 30, 40, 50];

const imagePool = [
  "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800",
  "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
];

const generateMedicines = (count = 500) => {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const category = categories[i % categories.length];
    const form = forms[i % forms.length];
    const dose = doses[i % doses.length];
    const brand = brands[i % brands.length];
    const pack = packSizes[i % packSizes.length];
    const onSale = i % 2 === 0;

    const base = {
      name: `${category} ${brand} ${dose} (${form}, ${pack} дана)`,
      image: imagePool[i % imagePool.length],
      description: `${category} препараты, ${dose}, ${form} түрі.`,
      inStock: true,
      onSale,
    };

    if (onSale) {
      const listPrice = 750 + ((i * 127) % 7200);
      const price = Math.max(199, Math.round(listPrice * 0.66));
      list.push({ ...base, price, listPrice });
    } else {
      const price = Math.max(199, 450 + ((i * 97) % 6800));
      list.push({ ...base, price });
    }
  }
  return list;
};

const migrateLegacyPrices = async () => {
  const legacy = await Medicine.find({ onSale: { $exists: false } });
  let i = 0;
  for (const m of legacy) {
    const wantSale = i % 2 === 0;
    if (wantSale) {
      if (!m.listPrice) {
        m.listPrice = Math.max(m.price + 100, Math.round(m.price * 1.42));
        m.price = Math.max(150, Math.round(m.price * 0.68));
      }
      m.onSale = true;
    } else {
      m.listPrice = undefined;
      m.onSale = false;
    }
    await m.save();
    i += 1;
  }
  if (legacy.length) console.log(`${legacy.length} дәрі бағасы жаңартылды (жеңілдік/стандарт)`);
};

const seedInitialData = async () => {
  const admin = await User.findOne({ email: "admin@pharmapp.kz" });
  if (!admin) {
    const password = await bcrypt.hash("Admin123!", 10);
    await User.create({
      name: "Әкімші",
      email: "admin@pharmapp.kz",
      password,
      role: "admin",
    });
    console.log("Әкімші аккаунты жасалды: admin@pharmapp.kz / Admin123!");
  }

  const courier = await User.findOne({ email: "courier@pharmapp.kz" });
  if (!courier) {
    const password = await bcrypt.hash("Courier123!", 10);
    await User.create({
      name: "Курьер",
      email: "courier@pharmapp.kz",
      password,
      role: "courier",
      phone: "+7 700 000 00 00",
    });
    console.log("Курьер аккаунты жасалды: courier@pharmapp.kz / Courier123!");
  }

  const count = await Medicine.countDocuments();
  if (count < 500) {
    const medicines = generateMedicines(500 - count);
    await Medicine.insertMany(medicines);
    console.log(`${medicines.length} дәрі қосылды (жалпысы кемінде 500)`);
  }

  await migrateLegacyPrices();
};

module.exports = seedInitialData;
