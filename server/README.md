# BlogWeb Server

This is the Express backend for the BlogWeb application.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your PostgreSQL connection string.
3. Set `JWT_SECRET` to a secure random value.

## Scripts

- `npm run dev` - start the server in development with hot reload.
- `npm run server` - start the server via nodemon.
- `npm run build` - compile TypeScript to `dist`.
- `npm run start` - run the compiled production server.

## Database

On startup, the server will automatically create the required `users` and `blog_posts` tables if they do not already exist.

## API

- `GET /api` - health check
- `POST /api/signup` - create a new user
- `POST /api/login` - login and receive a JWT
- `GET /api/me` - get current logged in user
- `GET /api/posts` - list blog posts
- `GET /api/posts/:slug` - get a post by slug
- `POST /api/posts` - create a new post (authenticated)
- `PUT /api/posts/:id` - update a post (authenticated)
- `DELETE /api/posts/:id` - delete a post (authenticated)
