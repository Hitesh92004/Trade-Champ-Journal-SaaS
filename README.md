# Trade Champ

Trade Champ is a full-stack SaaS trading journal for MetaTrader 5 traders. It provides automatic trade syncing, analytics dashboards, journaling, and prop-firm risk tracking.

## Project Structure

```bash
trade-champ/
  frontend/   # Next.js 14 + TypeScript + Tailwind + Recharts
  backend/    # FastAPI services
  workers/    # MT5 sync worker
  database/   # Supabase SQL schema and RLS
  docker/     # Docker Compose stack
  docs/       # Architecture notes
```

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker + Docker Compose (optional)
- Supabase project
- MetaTrader 5 terminal/API environment

## Local Setup

1. Copy environment template:
   ```bash
   cp trade-champ/.env.example trade-champ/.env
   ```
2. Fill in Supabase and MT5 secrets in `trade-champ/.env`.
3. Place your brand logo at:
   - `trade-champ/frontend/public/logo.png`

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

Run `trade-champ/database/schema.sql` in Supabase SQL editor.

This creates:
- `users`
- `mt5_accounts`
- `trades`
- `strategies`
- `prop_settings`

with Row Level Security policies so users only access their own data.

## Docker (Full Stack)

```bash
cd trade-champ/docker
docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api/health`
- Worker: background MT5 sync service

## Key Features Included

- Supabase Auth-ready login/signup screens
- MT5 account connection API endpoint
- Automated worker-based MT5 trade sync skeleton
- Trade dashboard with core SaaS metrics
- Trade list + filters + detail journaling page
- Strategy tagging support
- Prop firm tracker module
- Supabase Storage-ready screenshot field (`screenshot_url`)
