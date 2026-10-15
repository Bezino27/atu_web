# ATU Košice frontend

Next.js frontend for the ATU Košice website.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Production environment

Set these required variables in the deployment platform and Docker build environment:

- `NEXT_PUBLIC_API_URL` — public Django API base URL, including `/api` (for example `https://atukosice.sk/api`).
- `NEXT_PUBLIC_MEDIA_ORIGIN` — HTTPS origin serving uploaded media (for example `https://atukosice.sk`).
- `NEXT_PUBLIC_ADMIN_URL` — explicit HTTPS URL of the administration frontend. Production intentionally has no HTTP/IP fallback.
- `REVALIDATE_SECRET` — server-only secret used by the revalidation endpoint. Never expose it as a `NEXT_PUBLIC_*` variable or commit it.

`NEXT_PUBLIC_SITE_URL` remains an optional Docker compatibility value. The current canonical site URL is fixed to `https://atukosice.sk` in the SEO configuration.

The `NEXT_PUBLIC_*` values are embedded into the client/build output where used and are not secrets. `REVALIDATE_SECRET` must be supplied only at runtime to the server container.

Before a release, run:

```bash
npm audit --omit=dev
npm run lint
npx tsc --noEmit
npm run build
```
