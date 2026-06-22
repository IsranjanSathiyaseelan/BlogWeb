# BlogWeb

BlogWeb is a full-stack blog application with a React + TypeScript frontend and an Express + TypeScript backend.

## Features

- Read blog posts on the home feed and post detail pages
- Filter posts by category and search by title, excerpt, or author
- JWT-based authentication (`signup`, `login`, `me`)
- Create, edit, and delete blog posts for authenticated users
- Legal/info pages: About, Privacy, Terms, Cookies
- Responsive UI with separate page-level styles

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Axios
- Backend: Node.js, Express, TypeScript, PostgreSQL, Prisma
- Auth: JSON Web Token (JWT)

## Project Structure

```text
BlogWeb/
	client/   # React app (Vite)
	server/   # Express API
```

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

## Environment Setup

In the server folder:

1. Copy `.env.example` to `.env`
2. Update values:

```env
DATABASE_URL=postgres://user:password@localhost:5432/blogweb
JWT_SECRET=your_jwt_secret
PORT=3000
```

Frontend API base URL:

- Client uses `VITE_API_BASE_URL` if set
- Otherwise it defaults to `/api`

## Install Dependencies

From the project root:

```bash
cd client
npm install

cd ../server
npm install
```

## Run Locally

Start backend (Terminal 1):

```bash
cd server
npm run server
```

Start frontend (Terminal 2):

```bash
cd client
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Build

Frontend:

```bash
cd client
npm run build
```

Backend:

The server currently doesn't include a dedicated `build` script. For development use the provided dev server (`npm run server`).

To compile the server for production you can run the TypeScript compiler manually and then run the compiled output:

```bash
cd server
npx tsc
node dist/index.js
```

## Scripts

Client (`client/package.json`):

- `npm run dev` - run Vite dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

Server (`server/package.json`):

- `npm run server` - run the API in development with `ts-node-dev` (auto-restart)
- `npm run start` - run the server with `ts-node`

## API Endpoints

Base path: `/api`

- `GET /api` - health check
- `POST /api/signup` - create user
- `POST /api/login` - login
- `GET /api/me` - get current user (auth required)
- `GET /api/posts` - list posts
- `GET /api/posts/:slug` - get a post by slug
- `POST /api/posts` - create post (auth required)
- `PUT /api/posts/:id` - update post (auth required)
- `DELETE /api/posts/:id` - delete post (auth required)

## Admin

The project includes a lightweight admin API and a frontend admin dashboard for managing users and viewing basic metrics. Admin access is protected by a separate admin JWT and validated against credentials configured via environment variables.

Environment variables (server `.env`):

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=someStrongPassword
ADMIN_JWT_SECRET=another_secret_for_admin_tokens
```

Admin API endpoints (base path `/api`):

- `POST /api/admin/login` - authenticate as admin (body: `{ "email": "...", "password": "..." }`) → returns `{ token }`
- `GET /api/admin/verify` - verify admin token (requires `Authorization: Bearer <token>`)
- `GET /api/admin/metrics` - get high-level metrics (users, blogs)
- `GET /api/admin/users` - list users (limited to 100)
- `DELETE /api/admin/users/:id` - delete a user by id

Example: login with `curl` and fetch metrics

```bash
# Login (returns token)
curl -s -X POST http://localhost:3000/api/admin/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@example.com","password":"someStrongPassword"}'

# Use token from response to call protected endpoint
curl -s http://localhost:3000/api/admin/metrics \
	-H "Authorization: Bearer <token>"
```

Frontend admin UI:

- Admin login page: `/admin/login`
- Admin dashboard (metrics & user management): `/admin/dashboard`

Notes and security:

- Admin credentials are read from environment variables; there is no built-in admin user in the database. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the server `.env` before starting the server.
- Tokens issued by the admin login use `ADMIN_JWT_SECRET`; keep this secret different from the regular `JWT_SECRET` used for user auth.
- For production, store admin credentials and secrets in a secure secret store (Vault, cloud secret manager, etc.) and avoid committing `.env` to source control.

## Notes

- Backend CORS currently allows:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- Keep both frontend and backend running during local development.
