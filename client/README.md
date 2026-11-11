# BlogWeb Client

React 19 + TypeScript single-page application built with Vite and React Router 7.

---

## Highlights

- **Automatic Blog Cover Component (`BlogCover.tsx`)**:
  - Dynamically renders responsive SVG covers using 9 gradient presets and subtle decorative geometry.
  - Generates deterministic color combinations based on post IDs/titles via djb2 hashing.
  - Three distinct variants: `card` (16:9 thumbnails), `spotlight` (featured articles), and `hero` (article headers).

- **On-Device ML Recommendation Engine (`recommendations.ts`)**:
  - Uses client-side TF-IDF and Cosine Similarity vector matching.
  - Analyzes titles (3×), categories (2×), keywords (2×), excerpts, and descriptions.
  - Suggests top 3–5 relevant articles on blog detail pages, excluding the current post and deduplicating matches.
  - Zero external API dependencies or fees.

- **10 Curated Dummy IT Stories (`dummy.js`)**:
  - In-depth sample articles across 10 technology domains:
    - Artificial Intelligence and Machine Learning
    - Web Development
    - React and JavaScript
    - Cybersecurity
    - Cloud Computing
    - Software Engineering
    - Data Science
    - Python Programming
    - DevOps and Automation
    - Emerging Technologies
  - Stored purely client-side; tagged with distinguishable `Demo Story` badges in the UI.

- **Interactive SVG Dashboards**:
  - Admin & user dashboards featuring custom SVG line charts, area charts, and bar charts.

---

## Scripts

```bash
# Start development server
npm run dev

# Type-check and build for production
npm run build

# Preview production build locally
npm run preview

# Lint the codebase
npm run lint
```
