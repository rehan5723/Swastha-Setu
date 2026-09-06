# SwasthaSetu

Monorepo scaffold with `frontend` (Vite + React) and `backend` (Express).

Prerequisites:
- Node.js 18+ and npm

Install and run (from repository root):

```
npm install
npm run dev
```

What this does:
- Installs dependencies for root and workspaces
- Runs frontend on http://localhost:3000 and backend on http://localhost:4000

Notes:
- Frontend Vite dev server proxies `/api` to the backend.
- To run services individually, use `npm --workspace frontend run dev` or `npm --workspace backend run dev`.
