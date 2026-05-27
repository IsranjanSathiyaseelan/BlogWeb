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
npm run dev
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

```bash
cd server
npm run build
```

## Scripts

Client (`client/package.json`):

- `npm run dev` - run Vite dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

Server (`server/package.json`):

- `npm run dev` - run API in dev mode with reload
- `npm run server` - run API with nodemon + ts-node
- `npm run build` - compile TypeScript to `dist`
- `npm run start` - run compiled server

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

## Notes

- Backend CORS currently allows:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- Keep both frontend and backend running during local development.
