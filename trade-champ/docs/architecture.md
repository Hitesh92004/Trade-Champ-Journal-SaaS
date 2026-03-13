# Trade Champ Architecture

- **frontend/**: Next.js 14 UI with App Router, Tailwind, Supabase auth forms, and Recharts widgets.
- **backend/**: FastAPI API for authenticated account/trade/prop endpoints.
- **workers/**: Long-running MT5 sync worker that imports trades to Supabase.
- **database/**: PostgreSQL schema + RLS policies for secure multi-tenant access.
- **docker/**: Docker Compose stack for local full-stack runtime.

## Asset note

Branding is consumed from `frontend/public/logo.png`. Keep the asset local for runtime and avoid unnecessary binary-file churn in PRs when possible.


## Deployment blueprint

- `render.yaml` provides a Render Web Service blueprint for the FastAPI backend in `trade-champ/backend`.
