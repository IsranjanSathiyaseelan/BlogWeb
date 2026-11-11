# BlogWeb

BlogWeb is a modern full-stack blog application featuring a clean, blog-centric React 19 + TypeScript frontend and an Express + Prisma + PostgreSQL backend with interactive SVG charts for Admin and User dashboards, automated SVG cover generation, and an on-device TF-IDF machine learning recommendation system.

---

## Key Features

- **Automatic Blog Cover Generation (`BlogCover.tsx`)**:
  - Replaces manual image uploads with dynamically generated, responsive SVG covers.
  - Deterministic color generation via djb2 string hashing on post ID/title (same post always gets the same gradient).
  - 9 rich modern gradient presets layered with subtle decorative geometric shapes and animated hover scaling.
  - Sized adaptively with three variants: `card` (16:9 thumbnails), `spotlight` (homepage hero), and `hero` (article headers).

- **Lightweight ML Recommendation System**:
  - Pure client-side recommendation engine powered by **TF-IDF (Term Frequency - Inverse Document Frequency)** and **Cosine Similarity**.
  - Analyzes composite article features: titles (weighted 3×), categories (weighted 2×), keywords (weighted 2×), excerpts, and descriptions.
  - Dynamically calculates the top 3–5 most relevant articles on individual blog detail pages.
  - Strictly excludes the active post and prevents duplicate recommendations.
  - Operates with zero external API calls or paid AI services.

- **10 Curated IT Reference Stories (`dummy.js`)**:
  - 10 in-depth, realistic articles covering major modern technology domains:
    1. Artificial Intelligence and Machine Learning
    2. Web Development
    3. React and JavaScript
    4. Cybersecurity
    5. Cloud Computing
    6. Software Engineering
    7. Data Science
    8. Python Programming
    9. DevOps and Automation
    10. Emerging Technologies
  - Stored purely client-side without altering database records or backend schemas.
  - Clearly distinguishable via subtle `Demo Story` indicator badges.
  - Fully integrated into search, category filters, and recommendation pools.

- **Minimal Home Feed**: Streamlined blog reading experience with category filters, spotlight featured article, and real-time search.
- **Interactive Dashboards**: Modern SVG charts for publishing trends, category breakdowns, and user growth velocity.
- **User Dashboard**: Personal overview displaying user profile, published articles count, monthly publishing velocity, and topic breakdown.
- **Admin Dashboard**: System health overview featuring global metrics, platform activity charts, user growth metrics, user management, and posts management with author email search.
- **JWT-Based Authentication**: Separate secure authentication flows for Users (`signup`, `login`, `me`) and Admin (`login`, `verify`).
- **Post Management**: Create, edit, search, and delete blog posts with author metadata.
- **Legal Pages**: About, Privacy Policy, Terms of Service, and Cookies Policy pages.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router 7, Axios, Vanilla CSS (Design Tokens & CSS Modules)
- **ML / Algorithms**: Client-Side TF-IDF & Cosine Similarity vector engine, djb2 deterministic hashing
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Auth**: JSON Web Token (JWT)

---

## Project Structure

```text
BlogWeb/
├── client/                      # Vite + React 19 SPA
│   ├── src/
│   │   ├── api/                 # Modular Axios clients & endpoints
│   │   ├── components/
│   │   │   ├── admin/           # Admin layout & route guards
│   │   │   ├── blog/
│   │   │   │   ├── blogcard/    # Responsive blog card component
│   │   │   │   └── blogcover/   # Automatic SVG blog cover generator
│   │   │   ├── common/          # Buttons, modals, charts, navbar, footer
│   │   │   └── user/            # User guards & layouts
│   │   ├── context/             # Global Blog & Auth context providers
│   │   ├── data/
│   │   │   └── dummy.js         # 10 realistic IT reference stories
│   │   ├── pages/               # Public pages, blog reader, and dashboards
│   │   ├── routes/              # Protected route definitions
│   │   ├── types/               # TypeScript interfaces & types
│   │   └── utils/
│   │       └── recommendations.ts # TF-IDF & Cosine Similarity engine
│   └── tsconfig.app.json
└── server/                      # Express API server
    ├── src/
    │   ├── config/              # Prisma & environment variables
    │   ├── controllers/         # Admin, blog, dashboard, & chart controllers
    │   ├── middleware/          # Admin & User JWT auth middlewares
    │   └── routes/              # Express router endpoints
    └── prisma/
        └── schema.prisma        # Database schema
```

---

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

---

## Environment Setup

In the `server` folder, create `.env`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/blogweb
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
PORT=3000
```

In the `client` folder (optional):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Install Dependencies

From the project root:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## Database Migration

Set up the PostgreSQL schema via Prisma:

```bash
cd server
npx prisma db push
```

---

## Run Locally

Start backend server (Terminal 1):

```bash
cd server
npm run server
```

Start frontend dev server (Terminal 2):

```bash
cd client
npm run dev
```

Default local URLs:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000/api`

---

## Production Build

Build frontend:

```bash
cd client
npm run build
```

Build & start server:

```bash
cd server
npx tsc
node dist/index.js
```

---

## Recommendation System Details

The recommendation algorithm in `client/src/utils/recommendations.ts` operates as follows:

1. **Document Representation**:
   $$\text{Doc}(p) = 3 \times \text{Title} + 2 \times \text{Category} + 2 \times \text{Keywords} + \text{Excerpt} + \text{Description}$$
2. **Text Preprocessing**: Lowercased, stripped of non-alphanumeric noise, and filtered through an English stopword dictionary.
3. **Term Frequency (TF)**:
   $$\text{TF}(t, d) = \frac{\text{count}(t, d)}{|d|}$$
4. **Inverse Document Frequency (IDF)**:
   $$\text{IDF}(t) = \ln\left(1 + \frac{N}{1 + \text{DF}(t)}\right) + 1$$
5. **Cosine Similarity**:
   $$\text{CosineSim}(V_A, V_B) = \frac{\sum_t V_A[t] \cdot V_B[t]}{\|V_A\| \|V_B\|}$$
6. **Filtering & Ranking**: Filters out the active post ID/slug, deduplicates candidate IDs, and delivers the top 3–5 most relevant articles.

---

## API Endpoints

Base path: `/api`

### Public & User Routes
- `GET /api` - Health check
- `POST /api/signup` - Register a new user
- `POST /api/login` - User login
- `GET /api/me` - Get current user profile (Auth required)
- `GET /api/posts` - List all blog posts
- `GET /api/posts/my` - List current user's blog posts (Auth required)
- `GET /api/posts/:slug` - Get a post by slug
- `POST /api/posts` - Create post (Auth required)
- `PUT /api/posts/:id` - Update post (Auth required)
- `DELETE /api/posts/:id` - Delete post (Auth required)

### Analytics & Chart Routes
- `GET /api/charts/admin/activity` - Monthly articles, pageviews, users & sessions (Admin Auth required)
- `GET /api/charts/admin/categories` - System-wide category distribution (Admin Auth required)
- `GET /api/charts/admin/user-growth` - Monthly user signups & session velocity (Admin Auth required)
- `GET /api/charts/user/activity` - User monthly article publishing velocity (User Auth required)
- `GET /api/charts/user/categories` - User topic & category distribution (User Auth required)

### Admin Routes
- `POST /api/admin/login` - Authenticate admin (`{ email, password }`)
- `GET /api/admin/verify` - Verify admin JWT token
- `GET /api/admin/metrics` - Total user count, total blogs count, active sessions
- `GET /api/admin/users` - List all registered users (Admin Auth required)
- `DELETE /api/admin/users/:id` - Delete a user (Admin Auth required)
- `GET /api/dashboard` - User dashboard metrics & user post history

---

## Admin Portal

- **Admin Login**: `/admin/login`
- **System Overview Dashboard**: `/admin/dashboard`
- **Posts Management**: `/admin/posts` (Filter by title, category, author, or author email)
- **User Management**: `/admin/users`

---

## License

MIT License.
