# Moventrac Web (Next.js App Router)

Moventrac’s web frontend built with Next.js (App Router), React 18, and Tailwind CSS. It provides a landing page, authentication (login/register), and an authenticated dashboard for profile and workout records. The app proxies calls to the Moventrac backend via internal API route handlers.

## Tech Stack

- Framework: Next.js 14 (App Router)
- UI: React 18, Tailwind CSS, lightweight shadcn‑style primitives
- Charts: Recharts
- Auth: Cookie (httpOnly) carrying a JWT issued by the backend

## Features

- `/` Landing page with CTAs (Login, Sign Up) and APK download button
- `/login` Login (sets `moventrac_token` cookie via server route)
- `/register` User registration
- `/profile` Profile + summary stats (protected)
- `/records` Records list with filters, sort, details modal, delete (protected)
- Internal API proxies under `app/api/*` forward to the backend (`NEXT_PUBLIC_API_BASE`)

## Project Structure

- `app/` App Router pages and route handlers
  - `app/page.tsx` Landing page (includes “Download APK” button)
  - `app/login`, `app/register` Auth pages
  - `app/(app)/` Authenticated layout and pages (`profile`, `records`)
  - `app/api/*` Server route handlers that call the backend and set/read cookies
- `middleware.ts` Route protection for authenticated pages via cookie guard
- `src/components/ui/*` Minimal UI primitives (button, card, input, table, modal, select)
- `src/lib/env.ts` Reads `NEXT_PUBLIC_API_BASE` with a sensible default for local dev
- `public/` Static assets (served by Vercel/Next CDN). APK lives in `public/download/`.

## Environment Variables

- `NEXT_PUBLIC_API_BASE` (required in deployed environments)
  - Example (production): `https://moventrac-backend.vercel.app/api/`
  - Example (local dev): `http://localhost:3000/api/`

Create a `.env.local` during development:

```
NEXT_PUBLIC_API_BASE=http://localhost:3000/api/
```

## Development

- Install: `npm install`
- Run dev server: `npm run dev` (default port 3000; you can pass `-- -p 3001` to change)
- Build: `npm run build`
- Start (production server): `npm run start`
- Lint: `npm run lint`

Requirements: Node.js 18+ is recommended for Next.js 14.

## Authentication Flow

- Login: The page posts to `app/api/auth/login` which forwards to the backend `/api/auth/login`.
  - On success, it sets `moventrac_token` (httpOnly) and returns.
- Protected pages read the cookie on the server and forward the token as `Authorization: Bearer <token>` when calling backend APIs (see handlers under `app/api/*`).
- Logout: `app/api/auth/logout` clears the cookie and redirects to `/`.

Cookie name: `moventrac_token` (httpOnly). For production, setting the cookie with `secure: process.env.NODE_ENV === 'production'` is recommended.

## Backend Integration

All data comes from the Moventrac backend. Set `NEXT_PUBLIC_API_BASE` to the backend’s base URL (must include trailing slash and `/api/`), e.g.

```
NEXT_PUBLIC_API_BASE=https://moventrac-backend.vercel.app/api/
```

The internal route handlers call the backend and (when needed) attach `Authorization: Bearer <token>` using the cookie.

## APK Download

- The landing page includes a “Download APK” button that links to a static asset at `/download/moventrac-latest.apk`.
- To update the APK:
  - Place the file at `public/download/moventrac-latest.apk` (create the folder if missing)
  - Redeploy the app to propagate the new asset via CDN

## Deployment (Vercel)

1. Link the project

- `vercel login`
- `vercel link` (choose the team/project)

2. Configure environment variables

- `vercel env set NEXT_PUBLIC_API_BASE https://moventrac-backend.vercel.app/api/ preview`
- `vercel env set NEXT_PUBLIC_API_BASE https://moventrac-backend.vercel.app/api/ production`

3. Deploy

- Preview: `vercel`
- Production: `vercel --prod`

Static assets under `public/` (including the APK) are served by Vercel’s CDN. Hobby plan limits apply for bandwidth; consider external object storage/CDN for large or high‑traffic downloads.

## Troubleshooting

- 401/403 on protected pages: ensure your backend URL is correct and login succeeded (cookie present). Token expiry is 1h by default.
- Network/CORS: the backend should allow calls from your frontend domain. The provided backend uses permissive CORS by default but ideally restrict by origin in production.
- Wrong redirects after logout: handled by `app/api/auth/logout` returning a 303 redirect to `/`.

## Scripts

- `npm run dev` — Start the Next.js dev server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run lint` — Lint the project

---
