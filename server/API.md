# PharmApp API

Base URL: `http://localhost:5000/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`

## User

- `GET /users/me`
- `PATCH /users/me`

## Products & Reviews

- `GET /products?search=&category=&onlyPromo=&minPrice=&maxPrice=&inStock=&pharmacyId=`
- `GET /products/:id/reviews`
- `POST /products/:id/reviews`

## Cart & Orders

- `GET /cart`
- `POST /cart`
- `DELETE /cart/:id`
- `POST /orders/checkout`
- `GET /orders/my`

## Payments

- `POST /payments/:orderId/simulate`

## Pharmacies

- `GET /pharmacies`
- `GET /pharmacies/nearest?lat=51.1&lng=71.4`

## Wishlist

- `GET /wishlist`
- `POST /wishlist`
- `DELETE /wishlist/:id`

## Notifications

- `GET /notifications`

## Courier

- `GET /courier/orders`
- `PATCH /courier/orders/:id`

## Admin

- `GET /admin/stats`
- `GET /admin/products`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `GET /admin/orders`
- `PATCH /admin/reviews/:id/moderate`

## Авторизация

Для защищенных роутов используйте:

`Authorization: Bearer <JWT_TOKEN>`
