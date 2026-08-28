# fe-sso — SSO Portal & Yellow Pages Frontend

Centralized SSO portal + Yellow Pages directory. Vite + React + Tailwind

## Stack
- Node 20, TypeScript, Vite + React
- Tailwind 3, React Router, Axios
- Auth via JWT (localStorage + Bearer interceptor, 401 → /login)

## Prerequisites
- Node 20+
- `VITE_API_URL` pointing to BE (default `http://localhost:3000`)

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

App at `http://localhost:5173` when running (BE at `http://localhost:3000`, docs at `http://localhost:3000/docs`).

## Env

See `.env.example`:

| Key | Description | Example |
|---|---|---|
| `VITE_API_URL` | BE base URL | `http://localhost:3000` |

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | public | Login (username/password) |
| `/` | auth | Landing — user info + accessible apps |
| `/yellow-pages` | auth + Yellow Pages grant | Contacts list, search/filter, detail, create/edit/deactivate (Admin) |
| `/admin/users` | Admin | Users CRUD, search, pagination, role/status |
| `/admin/apps` | Admin | Applications + grant/revoke access |
| `/admin/audit-logs` | Admin | Audit trail (filtered, paginated) |

## Seed Accounts

| Username | Password | Role | Access |
|---|---|---|---|
| budi | budi123 | Admin | Yellow Pages, HR Portal |
| siti | siti123 | User | Yellow Pages |
| andi | andi123 | User | Yellow Pages |
| rina | rina123 | User | (none — 403 on /yellow-pages) |
| joko | joko123 | Admin | HR Portal, Document Portal |
