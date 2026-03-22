# Trade Champ

Trade Champ is a full-stack SaaS trading journal for MetaTrader 5 traders. It includes Supabase auth, MT5 account connection, automated trade sync worker, analytics dashboard, journaling, and prop-firm tracking.

## Project Structure

```bash
trade-champ/
  frontend/   # Next.js 14 + TypeScript + Tailwind + ShadCN-style UI + Recharts
  backend/    # FastAPI API with Supabase-backed services
  workers/    # MT5 sync worker service
  database/   # Supabase PostgreSQL schema + RLS policies
  docker/     # Docker Compose stack
  docs/       # Architecture notes
```

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker + Docker Compose (optional)
- Supabase project
- MetaTrader 5 terminal/API runtime

## Local Setup

1. Copy env file:
   ```bash
   cp trade-champ/.env.example trade-champ/.env
   ```
2. Fill values in `trade-champ/.env`.
3. Put your official brand logo at:
   - `trade-champ/frontend/public/logo.png`


## Logo Asset Workflow (important for PRs)

Some PR systems do not render binary diffs (for example `logo.png`).

Recommended workflow:
- Keep app code referencing `trade-champ/frontend/public/logo.png`.
- Add or replace `logo.png` locally when running the app.
- Avoid frequent logo binary edits in code-review PRs unless explicitly required.

## Run Frontend

```bash
cd trade-champ/frontend
npm install
npm run dev
```

## Run Backend

```bash
cd trade-champ/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run Worker

```bash
cd trade-champ/workers
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python sync_worker.py
```

## Database Setup (Supabase)

Run `trade-champ/database/schema.sql` in the Supabase SQL editor.

Tables created:
- `users`
- `mt5_accounts`
- `trades`
- `strategies`
- `prop_settings`

RLS policies are enabled so users can access only their own rows.

## API Endpoints

- `GET /api/health`
- `POST /api/mt5/connect`
- `GET /api/dashboard/overview`
- `GET /api/trades`
- `GET /api/trades/{id}`
- `PUT /api/prop-settings`

All protected endpoints expect `Authorization: Bearer <supabase_jwt>`.


## Render Deployment (Backend)

Recommended: deploy backend as a Render **Web Service** from subdirectory `trade-champ/backend`.

This repo includes a `render.yaml` blueprint with:
- `rootDir: trade-champ/backend`
- build command: `pip install --upgrade pip setuptools wheel && pip install -r requirements.txt`
- start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Required Render env vars:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MT5_CREDENTIAL_SECRET`
- `CORS_ORIGINS` (set to your Vercel URL, optionally comma-separated with localhost)

Build-stuck troubleshooting:
- Ensure Render **Root Directory** is `trade-champ/backend`.
- Ensure start command uses `$PORT` (not fixed `8000`).
- Backend requirements intentionally exclude `MetaTrader5`; that package should stay in `workers/requirements.txt` because it commonly fails on Linux cloud builders.
- Pin Python to 3.11.x on Render (the blueprint sets `PYTHON_VERSION=3.11.9`; backend also ships `runtime.txt`).
- If you see `pydantic-core` / `maturin` / `cargo` errors with Python 3.14, switch Render Python to 3.11 and redeploy.

## Vercel Deployment (Frontend)

If you deploy this repository directly to Vercel, the Next.js app lives in a subdirectory.
This repo includes a root `vercel.json` that points Vercel to `trade-champ/frontend/package.json`.

Required Vercel Environment Variables for the frontend project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

Important:
- The FastAPI backend and MT5 worker are **not** deployed by Vercel in this setup.
- Deploy backend/worker separately (for example Railway/Render/Fly.io) and set `NEXT_PUBLIC_API_URL` to that backend URL.

## Docker (Full Stack)

```bash
cd trade-champ/docker
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Worker: periodic MT5 sync service

## Included Product Modules

- Supabase signup/login auth forms
- MT5 account connection flow with encrypted password storage
- Automated MT5 trade sync worker
- Dashboard metrics + equity chart
- Trades table with filtering
- Trade detail journal view with screenshot upload field
- Strategy tagging model support
- Prop-firm guardrails tracking model
