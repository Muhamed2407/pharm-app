const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { prisma } = require("../utils/prisma");
const { createToken } = require("../utils/jwt");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/auth/register", async (req, res) => {
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    phone: z.string().optional(),
    address: z.string().optional()
  });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());

  const exists = await prisma.user.findUnique({ where: { email: body.data.email } });
  if (exists) return res.status(409).json({ message: "Пользователь уже существует" });

  const user = await prisma.user.create({
    data: { ...body.data, password: await bcrypt.hash(body.data.password, 10) }
  });

  const token = createToken(user);
  return res.json({ token, user: { ...user, password: undefined } });
});

router.post("/auth/login", async (req, res) => {
  const schema = z.object({ email: z.email(), password: z.string().min(6) });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());

  const user = await prisma.user.findUnique({ where: { email: body.data.email } });
  if (!user || !(await bcrypt.compare(body.data.password, user.password))) {
    return res.status(401).json({ message: "Неверный логин или пароль" });
  }

  const token = createToken(user);
  return res.json({ token, user: { ...user, password: undefined } });
});

router.get("/users/me", auth(), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  return res.json({ ...user, password: undefined });
});

router.patch("/users/me", auth(), async (req, res) => {
  const schema = z.object({ fullName: z.string().optional(), phone: z.string().optional(), address: z.string().optional() });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());
  const user = await prisma.user.update({ where: { id: req.user.sub }, data: body.data });
  return res.json({ ...user, password: undefined });
});

router.get("/products", async (req, res) => {
  const { search = "", category, onlyPromo, minPrice, maxPrice, inStock, pharmacyId } = req.query;
  const products = await prisma.product.findMany({
    where: {
      name: { contains: String(search), mode: "insensitive" },
      ...(category ? { category: String(category) } : {}),
      ...(pharmacyId ? { pharmacyId: String(pharmacyId) } : {}),
      ...(onlyPromo === "true" ? { isPromo: true } : {}),
      ...(inStock === "true" ? { inStock: true } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {})
            }
          }
        : {})
    },
    include: {
      pharmacy: true,
      reviews: { where: { approved: true } }
    }
  });

  const mapped = products.map((p) => ({
    ...p,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0
  }));
  res.json(mapped);
});

router.get("/products/:id/reviews", async (req, res) => {
  const reviews = await prisma.review.findMany({ where: { productId: req.params.id, approved: true }, include: { user: true } });
  res.json(reviews);
});

router.post("/products/:id/reviews", auth(), async (req, res) => {
  const schema = z.object({ rating: z.number().min(1).max(5), comment: z.string().min(4) });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());

  const review = await prisma.review.create({
    data: {
      productId: req.params.id,
      userId: req.user.sub,
      rating: body.data.rating,
      comment: body.data.comment
    }
  });
  res.status(201).json(review);
});

router.get("/cart", auth(), async (req, res) => {
  const items = await prisma.cartItem.findMany({ where: { userId: req.user.sub }, include: { product: true } });
  const total = items.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  res.json({ items, total });
});

router.post("/cart", auth(), async (req, res) => {
  const schema = z.object({ productId: z.string(), quantity: z.number().int().min(1).max(20).default(1) });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());

  const existing = await prisma.cartItem.findUnique({ where: { userId_productId: { userId: req.user.sub, productId: body.data.productId } } });
  const item = existing
    ? await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + body.data.quantity } })
    : await prisma.cartItem.create({ data: { ...body.data, userId: req.user.sub } });
  res.status(201).json(item);
});

router.delete("/cart/:id", auth(), async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

router.post("/orders/checkout", auth(), async (req, res) => {
  const schema = z.object({ paymentMethod: z.string().default("Kaspi simulation"), deliveryAddr: z.string().min(5) });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());

  const cart = await prisma.cartItem.findMany({ where: { userId: req.user.sub }, include: { product: true } });
  if (!cart.length) return res.status(400).json({ message: "Корзина пуста" });

  const total = cart.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  const order = await prisma.order.create({
    data: {
      userId: req.user.sub,
      totalAmount: total,
      deliveryAddr: body.data.deliveryAddr,
      paymentMethod: body.data.paymentMethod,
      items: {
        create: cart.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.product.discountPrice ?? i.product.price }))
      }
    },
    include: { items: true }
  });

  await prisma.notification.create({
    data: {
      userId: req.user.sub,
      title: "Заказ создан",
      message: `Заказ #${order.id.slice(-6)} принят и ожидает оплаты.`
    }
  });
  await prisma.cartItem.deleteMany({ where: { userId: req.user.sub } });

  res.status(201).json(order);
});

router.post("/payments/:orderId/simulate", auth(), async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.orderId },
    data: { paymentStatus: "PAID" }
  });
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: "Оплата подтверждена",
      message: `Оплата за заказ #${order.id.slice(-6)} успешно проведена.`
    }
  });
  res.json(order);
});

router.get("/orders/my", auth(), async (req, res) => {
  const orders = await prisma.order.findMany({ where: { userId: req.user.sub }, include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" } });
  res.json(orders);
});

router.get("/courier/orders", auth(["COURIER"]), async (req, res) => {
  const orders = await prisma.order.findMany({ where: { OR: [{ courierId: req.user.sub }, { courierId: null }] }, include: { user: true, items: true } });
  res.json(orders);
});

router.patch("/courier/orders/:id", auth(["COURIER"]), async (req, res) => {
  const schema = z.object({ status: z.enum(["PENDING", "DELIVERING", "DELIVERED"]) });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: body.data.status, courierId: req.user.sub } });
  res.json(order);
});

router.get("/pharmacies", async (_, res) => {
  const pharmacies = await prisma.pharmacy.findMany();
  res.json(pharmacies);
});

router.get("/pharmacies/nearest", async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const pharmacies = await prisma.pharmacy.findMany();

  const nearest = pharmacies
    .map((p) => ({
      ...p,
      distance: Math.hypot(p.latitude - lat, p.longitude - lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  res.json(nearest);
});

router.get("/wishlist", auth(), async (req, res) => {
  const items = await prisma.wishlistItem.findMany({ where: { userId: req.user.sub }, include: { product: true } });
  res.json(items);
});

router.post("/wishlist", auth(), async (req, res) => {
  const schema = z.object({ productId: z.string() });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());

  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user.sub, productId: body.data.productId } },
    update: {},
    create: { userId: req.user.sub, productId: body.data.productId }
  });
  res.status(201).json(item);
});

router.delete("/wishlist/:id", auth(), async (req, res) => {
  await prisma.wishlistItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

router.get("/notifications", auth(), async (req, res) => {
  const notifications = await prisma.notification.findMany({ where: { userId: req.user.sub }, orderBy: { createdAt: "desc" } });
  res.json(notifications);
});

router.get("/admin/stats", auth(["ADMIN"]), async (_, res) => {
  const [users, orders, reviews] = await Promise.all([
    prisma.user.count(),
    prisma.order.findMany(),
    prisma.review.count()
  ]);
  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  res.json({ users, orders: orders.length, reviews, revenue });
});

router.get("/admin/products", auth(["ADMIN"]), async (_, res) => {
  const products = await prisma.product.findMany({ include: { pharmacy: true } });
  res.json(products);
});

router.post("/admin/products", auth(["ADMIN"]), async (req, res) => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    imageUrl: z.string(),
    price: z.number(),
    discountPrice: z.number().optional(),
    inStock: z.boolean().default(true),
    isPromo: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    pharmacyId: z.string()
  });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());
  const product = await prisma.product.create({ data: body.data });
  res.status(201).json(product);
});

router.patch("/admin/products/:id", auth(["ADMIN"]), async (req, res) => {
  const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  res.json(product);
});

router.delete("/admin/products/:id", auth(["ADMIN"]), async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

router.get("/admin/orders", auth(["ADMIN"]), async (_, res) => {
  const orders = await prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: "desc" } });
  res.json(orders);
});

router.patch("/admin/reviews/:id/moderate", auth(["ADMIN"]), async (req, res) => {
  const schema = z.object({ approved: z.boolean() });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json(body.error.flatten());
  const review = await prisma.review.update({ where: { id: req.params.id }, data: { approved: body.data.approved } });
  res.json(review);
});

module.exports = { router };

