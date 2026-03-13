# Trade Champ Architecture

- **frontend/**: Next.js 14 UI with App Router, Tailwind, and Recharts dashboard widgets.
- **backend/**: FastAPI API for MT5 account connection and app services.
- **workers/**: Long-running MT5 sync worker that imports trades to Supabase.
- **database/**: PostgreSQL schema + RLS policies for secure multi-tenant access.
- **docker/**: Docker Compose stack for local full-stack runtime.
