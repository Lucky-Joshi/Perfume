# Essence Aura — Perfume E-Commerce

Full-stack fragrance storefront (customer + admin) with a React/Vite SPA and an
Express + Supabase REST API.

## Project Structure

```
├── frontend/          React 19 + Vite 6 + react-router-dom v7 (CSS modules, JS only)
├── backend/           Express API (port 5000, ESM), Supabase (PostgREST) as database
└── database/          schema.sql — tables, indexes and seed reference data
```

## Getting Started

1. Install the Supabase schema

   Run `database/schema.sql` against a Supabase PostgreSQL connection (SQL editor).
   Confirm email confirmations are NOT required (or add `?confirm_email=false` to
   your Supabase Auth settings link).

2. Configure the backend

   ```bash
   cp backend/.env.example backend/.env
   ```

   Fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`,
   `REFRESH_TOKEN_SECRET`, `MAILTRAP_*` SMTP credentials and, optionally,
   `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

3. Start the API

   ```bash
   cd backend
   npm install
   npm run seed   # creates the bootstrap admin user + 15 demo products
   npm run dev
   ```

   The server runs on `http://localhost:5000` — check `GET /api/health`.

4. Run the storefront

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`. Vite proxies `/api` and `/uploads` to the API.

## Default Admin

- Email: `admin@essenceaura.com` (override with `ADMIN_EMAIL` in `.env`)
- Password: `Admin@12345` (override with `ADMIN_PASSWORD`)

## Environment Variables

| Variable                     | Required | Description                                        |
| ---------------------------- | -------- | -------------------------------------------------- |
| `PORT`                       | no       | API port (default 5000)                            |
| `NODE_ENV`                   | no       | `production` enables secure cookies                |
| `SUPABASE_URL`               | yes      | Supabase project URL                               |
| `SUPABASE_ANON_KEY`          | no       | Supabase anon key                                  |
| `SUPABASE_SERVICE_ROLE_KEY`  | yes      | Service-role key (bypasses RLS)                    |
| `JWT_ACCESS_SECRET`          | yes      | Access-token signing secret                        |
| `JWT_REFRESH_SECRET`         | yes      | Refresh-token signing secret                       |
| `JWT_ACCESS_EXPIRES`         | no       | e.g. `15m`                                         |
| `JWT_REFRESH_EXPIRES`        | no       | e.g. `7d`                                          |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` | no | SMTP creds for outbound mail |
| `EMAIL_FROM`                 | no       | From address for outbound mail                     |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | no  | Bootstrap admin credentials (see seed)             |
| `FRONTEND_URL`               | no       | Frontend origin for email links (default :3000)    |

## Notable Features

- Customer: catalog filters, search, product detail + reviews, cart, checkout
  (COD / credit card), order history, wishlist, newsletters, contact form.
- Auth: register/login, access + refresh tokens (httpOnly cookie fallback),
  email verification, password reset.
- Admin (`/admin`): dashboard with revenue chart, product/category CRUD with
  image upload, order status management, user moderation, review moderation,
  messages, newsletter subscribers and store settings.

## API Response Shape

All endpoints return `{ success, message, data, meta }`. `data` holds the payload
(lists are raw arrays here), pagination info lives in `meta`.