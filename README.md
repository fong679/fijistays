# FijiStays 🌴

**Authentic village eco-tourism booking platform for Fiji**

Connect visitors directly with Fijian village communities — kava ceremonies, island homestays, reef eco-tours, and cultural immersions. 87% of every booking goes straight to the village.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Backend | NestJS · TypeScript · Prisma ORM |
| Database | PostgreSQL 16 |
| Cache / queues | Redis 7 |
| Payments | Stripe Connect (scaffolded — add your keys) |
| Dev proxy | Nginx |
| Containerisation | Docker Compose |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 4.x+
- Git

That's it. Node.js is not required on your host machine.

---

## Quick start

```bash
# 1. Clone
git clone <your-repo-url> fijistays
cd fijistays

# 2. Add your Stripe test keys (optional — app runs without them)
#    Edit backend/.env  → STRIPE_SECRET_KEY=sk_test_...
#    Edit frontend/.env.local → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# 3. Start everything
docker compose up --build

# First run takes ~3–5 minutes (downloads images, installs npm deps, runs migrations)
```

Once up, open:

| URL | Service |
|-----|---------|
| http://localhost | Full app (via Nginx) |
| http://localhost:3000 | Next.js frontend (direct) |
| http://localhost:3001/api/v1 | NestJS API (direct) |
| http://localhost:3001/api/docs | Swagger UI |

---

## Seed data & demo accounts

The seed script runs automatically on first boot. It creates:

**Demo accounts**

| Role | Email | Password |
|------|-------|----------|
| Tourist | sarah@example.com | Tourist1234! |
| Host | sione@navala.fj | Host1234! |
| Admin | admin@fijistays.com.fj | Admin1234! |

**Villages**
- Navala Village — Ba Highlands, Viti Levu (Fiji's most authentic traditional village)
- Wayasewa Village — Waya Island, Yasawa Group
- Natokalau Village — Kadavu Island (Great Astrolabe Reef)

**Experiences**
- Highland Village Day — Kava, Culture & Panoramic Hike (FJ$125)
- Traditional Lovo Cooking Masterclass (FJ$75)
- Yasawa Island Village & Reef Snorkel (FJ$155)
- Yasawa Overnight Village Homestay (FJ$220)
- Great Astrolabe Reef Village Dive Experience (FJ$195)
- Manta Ray Encounter & Village Conservation Tour (FJ$145)

---

## Development workflow

```bash
# Start all services
docker compose up

# Watch backend logs only
docker compose logs -f backend

# Run a Prisma migration after schema changes
docker compose exec backend npx prisma migrate dev --name your_migration_name

# Open a psql shell
docker compose exec postgres psql -U fijistays -d fijistays

# Restart just the backend (after code changes if hot-reload isn't catching it)
docker compose restart backend

# Stop everything (preserves volumes / data)
docker compose stop

# Full reset — destroys all data and starts fresh
docker compose down -v && docker compose up --build
```

---

## Project structure

```
fijistays/
├── docker-compose.yml          # All services wired together
├── nginx/
│   └── nginx.conf              # Reverse proxy (port 80)
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/               # JWT auth, refresh tokens, guards
│   │   ├── bookings/           # Booking flow with optimistic locking
│   │   ├── common/             # Prisma + Redis shared modules
│   │   ├── experiences/        # Experience listings + availability
│   │   ├── payments/           # Stripe payment intents
│   │   ├── users/              # User profile management
│   │   └── villages/           # Village profiles + TLTB verification
│   ├── prisma/
│   │   └── schema.prisma       # Full data model
│   └── src/database/seed.sql   # Realistic Fiji seed data
└── frontend/                   # Next.js 14 app
    └── src/
        ├── app/                # App Router pages
        │   ├── page.tsx        # Homepage
        │   ├── experiences/    # Listing + detail + booking flow
        │   ├── login/          # Auth pages
        │   ├── register/
        │   ├── dashboard/      # Tourist dashboard
        │   └── host/           # Host dashboard
        ├── components/
        │   └── layout/         # Navbar, Footer
        └── lib/
            ├── api.ts          # Axios client + JWT interceptors
            └── store/auth.ts   # Zustand auth store
```

---

## API reference (key endpoints)

All endpoints are prefixed `/api/v1`. Full interactive docs at `/api/docs`.

```
POST   /auth/register          Register tourist or host
POST   /auth/login             Login → { accessToken, refreshToken, user }
POST   /auth/refresh           Rotate refresh token

GET    /villages               List verified villages
POST   /villages               Create village (HOST only)
GET    /villages/:id           Village detail + experiences + protocols

GET    /experiences            List experiences (filter: type, maxPrice, islandGroup)
POST   /experiences            Create experience (HOST only)
GET    /experiences/:id        Experience detail + availability

POST   /bookings               Create booking (TOURIST, authenticated)
GET    /bookings               My bookings
GET    /bookings/:id           Booking detail

POST   /payments/intent/:id    Create Stripe payment intent
POST   /payments/confirm/:id   Confirm payment (webhook in prod)
```

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Min 32-char secret for JWT signing |
| `JWT_ACCESS_EXPIRES` | Access token TTL (default `15m`) |
| `JWT_REFRESH_EXPIRES` | Refresh token TTL (default `30d`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `FRONTEND_URL` | CORS origin for frontend |
| `PORT` | API port (default `3001`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |

---

## Cultural protocol system

FijiStays has a built-in cultural protocol layer that ensures tourists are informed of and acknowledge iTaukei customs before booking. Protocols are:

- **Mandatory** (e.g. sevusevu kava presentation, dress code) — must be checked to complete booking
- **Advisory** (e.g. photography consent) — shown but not blocking

Protocols are stored in the database, linked to villages, and rendered in the booking flow with English and Fijian translations.

---

## Compliance

- **Fiji Privacy Act 2021** — explicit consent on registration, audit log on all data access, no raw payment data stored
- **PCI-DSS SAQ-A** — Stripe.js tokenisation, no card numbers on server
- **TLTB verification** — villages must upload a valid iTaukei Land Trust Board permit before listings go live

---

## Roadmap

- [ ] Stripe Connect payouts to village bank accounts
- [ ] M-PAiSA integration for local Fijian users
- [ ] React Native mobile app (offline-capable for remote islands)
- [ ] Mapbox village map on homepage
- [ ] SMS booking confirmations via Digicel Fiji API
- [ ] Multi-language support (English + Fijian)
- [ ] Review and rating system
- [ ] AWS deployment (ECS Fargate + RDS + ElastiCache)

---

## License

Proprietary — all rights reserved. Contact vinaka@fijistays.com.fj for licensing enquiries.
