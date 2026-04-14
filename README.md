# Pharm App

Астана қаласына арналған онлайн дәріхана веб-қосымшасы.

## Локал іске қосу

1. `server/.env.example` файлын `server/.env` етіп көшіріңіз.
2. `client/.env.example` файлын `client/.env` етіп көшіріңіз.
3. **MongoDB — әдепкі:** `server/.env` ішінде `USE_MEMORY_DB=true` тұрғанда Docker/Atlas қажет емес, жадтағы MongoDB автоматты қосылады. Алғашқы іске қосуда `mongodb-memory-server` MongoDB бинарилерін жүктеуі мүмкін (бір рет, көлемі үлкен болуы мүмкін).

4. Root ішінде:

```bash
npm install
npm run dev
```

**Нақты MongoDB қажет болса (дерек сақталсын):**

- **Docker:** `npm run mongo:up`, содан кейін `server/.env` ішінде `USE_MEMORY_DB=false` және `MONGO_URI=mongodb://127.0.0.1:27017/pharm-app`.
- **Atlas:** `server/.env.atlas.example` үлгісін қараңыз — `USE_MEMORY_DB=false`, `MONGO_URI=mongodb+srv://...`.

**Ескерту:** Docker жоқ болса, [Docker Desktop (Windows)](https://www.docker.com/products/docker-desktop/) орнатыңыз, содан кейін `npm run mongo:up` орындаңыз.

## Негізгі мүмкіндіктер

- JWT + bcrypt аутентификациясы
- Дәрі каталогы, іздеу, себет
- Checkout және тапсырыс жасау
- Жеке кабинет және тапсырыс статусы
- Админ панелі (дәрі/тапсырыс басқару)
- Толық responsive, қазақша интерфейс

## Deploy

### Backend (Render)
- Render-ге `server` бумасын deploy жасаңыз.
- Environment Variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `PORT` (optional)

### Frontend (Vercel)
- Vercel-ге `client` бумасын deploy жасаңыз.
- `VITE_API_URL` айнымалысына Render API URL беріңіз.

### Frontend (GitHub Pages)
- Репозиторийде `main`-ге push жасалғанда `.github/workflows/deploy-client-pages.yml` автоматты deploy жасайды.
- GitHub-та: **Settings -> Pages -> Source: GitHub Actions** етіп қойыңыз.
- `client/.env.example` ішіндегі `VITE_BASE_PATH` GitHub Pages үшін ескерілген.
- GitHub repo **Settings -> Secrets and variables -> Actions -> Variables** ішінде `VITE_API_URL` айнымалысын backend URL-ға қойыңыз.

## Әкімші тест аккаунты

- Email: `admin@pharmapp.kz`
- Құпиясөз: `Admin123!`

## Курьер тест аккаунты

- Email: `courier@pharmapp.kz`
- Құпиясөз: `Courier123!`

Курьерге әкімші тапсырысты тағайындағаннан кейін «Курьер» бетінде тапсырыс көрінеді.
