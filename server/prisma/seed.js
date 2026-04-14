const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const [adminPass, courierPass, userPass] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("courier123", 10),
    bcrypt.hash("user12345", 10)
  ]);

  const admin = await prisma.user.create({
    data: { email: "admin@pharmapp.kz", password: adminPass, fullName: "Админ PharmApp", role: "ADMIN" }
  });
  const courier = await prisma.user.create({
    data: { email: "courier@pharmapp.kz", password: courierPass, fullName: "Курьер Astana", role: "COURIER" }
  });
  const user = await prisma.user.create({
    data: { email: "user@pharmapp.kz", password: userPass, fullName: "Покупатель Demo", role: "CUSTOMER", address: "г. Астана, пр. Мангилик Ел 1" }
  });

  const pharmacies = await prisma.$transaction([
    prisma.pharmacy.create({ data: { name: "PharmApp Сарыарка", address: "Сарыарка 15", latitude: 51.165, longitude: 71.41 } }),
    prisma.pharmacy.create({ data: { name: "PharmApp Нура", address: "Туран 42", latitude: 51.107, longitude: 71.43 } }),
    prisma.pharmacy.create({ data: { name: "PharmApp Есиль", address: "Кабанбай батыра 58", latitude: 51.13, longitude: 71.45 } })
  ]);

  const categories = [
    "Обезболивающие",
    "Витамины",
    "БАД",
    "Антибиотики",
    "Сердце",
    "Давление",
    "Желудок",
    "Аллергия",
    "Кашель",
    "Горло",
    "Диабет",
    "Кожа"
  ];
  const baseNames = [
    "Парацетамол",
    "Ибупрофен",
    "Нурофен",
    "Аспирин",
    "Омепразол",
    "Супрастин",
    "Цитрамон",
    "Амоксициллин",
    "Азитромицин",
    "Колдрекс",
    "Терафлю",
    "Витамин C",
    "Витамин D3",
    "Магний B6",
    "Омега-3",
    "Пантенол",
    "Смекта",
    "Лоперамид",
    "Лоратадин",
    "Эналаприл"
  ];
  const imagePool = [
    "https://images.unsplash.com/photo-1585435557343-3b092031a831",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2",
    "https://images.unsplash.com/photo-1626716493137-b67fe9501e76"
  ];

  const productsData = Array.from({ length: 500 }, (_, i) => {
    const index = i + 1;
    const price = 700 + ((index * 137) % 18000);
    const hasDiscount = index % 3 !== 0;
    const discountPrice = hasDiscount ? Math.max(500, Math.round(price * (0.72 + (index % 10) * 0.02))) : null;
    return {
      name: `${baseNames[i % baseNames.length]} ${100 + (index % 900)} мг`,
      description: "Сертифицированный препарат для ежедневного применения",
      category: categories[i % categories.length],
      imageUrl: imagePool[i % imagePool.length],
      price,
      discountPrice,
      inStock: true,
      isPromo: Boolean(discountPrice),
      isBestSeller: index % 5 === 0,
      pharmacyId: pharmacies[i % pharmacies.length].id
    };
  });

  await prisma.product.createMany({ data: productsData });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });

  await prisma.review.createMany({
    data: [
      { productId: products[0].id, userId: user.id, rating: 5, comment: "Быстрая доставка и хороший эффект" },
      { productId: products[1].id, userId: user.id, rating: 4, comment: "Оригинальный витамин, отличная цена" }
    ]
  });

  await prisma.notification.create({
    data: { userId: user.id, title: "Добро пожаловать", message: "Ваш профиль создан. Получите скидку 10% на первый заказ." }
  });

  console.log("Seed completed", { admin: admin.email, courier: courier.email, user: user.email });
}

main().finally(async () => prisma.$disconnect());

