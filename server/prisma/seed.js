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

  const productsData = [
    { name: "Ибупрофен 200 мг", description: "Обезболивающее и жаропонижающее средство", category: "Обезболивающие", imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831", price: 1490, discountPrice: 1190, inStock: true, isPromo: true, isBestSeller: true, pharmacyId: pharmacies[0].id },
    { name: "Витамин D3", description: "Поддержка иммунитета и костной системы", category: "Витамины", imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88", price: 3990, discountPrice: 3290, inStock: true, isPromo: true, isBestSeller: true, pharmacyId: pharmacies[1].id },
    { name: "Омега-3", description: "Для сердца и сосудов", category: "БАД", imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2", price: 5890, inStock: true, isPromo: false, isBestSeller: false, pharmacyId: pharmacies[2].id },
    { name: "Парацетамол", description: "Снижение температуры и боли", category: "Обезболивающие", imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de", price: 990, inStock: true, isPromo: false, isBestSeller: true, pharmacyId: pharmacies[0].id }
  ];

  const products = [];
  for (const product of productsData) {
    products.push(await prisma.product.create({ data: product }));
  }

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

