# Event App — English UI & Vercel-ready

This project is prepared to run **frontend-only** on Vercel. It ships with a **client-side mock API** that intercepts requests to `http://localhost:3000/*` and serves data from `localStorage`, seeded from `/events.json` (in the `public` folder).

## How it works
- On first load, the app seeds `events` from `public/events.json`.
- All CRUD operations are handled in the browser and persisted to `localStorage` under the key `eventapp:data:v1`.
- Endpoints supported:
  - `GET /events`, `GET /events/:id`, `POST /events`, `PATCH /events/:id`, `DELETE /events/:id`
  - `GET /users`, `GET /categories` (empty arrays unless you add data via POST or seed manually).

## Local development
```bash
npm install
npm run dev
```
Open the app and it should load event data immediately.

## Deployment on Vercel
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- A `vercel.json` file is included to ensure SPA rewrites (deep-links will work).

## Resetting data
Clear the browser's localStorage (key: `eventapp:data:v1`) or open in a private window.

## Notes
- UI labels are fully translated to **English**.
- If your code imports more data types (users/categories), you can extend `public/events.json` or start adding them at runtime (the mock API supports POST).