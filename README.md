# Buryat Traditional Clothes - Diploma Project Architecture

This project is now split into clear layers:

- `frontend/` - customer-facing website (culture + guided measurements)
- `backend/` - REST API for validation and measurement submission
- `database/` - SQL schema and initialization scripts

## Why this separation is correct

- Frontend can evolve UX independently.
- Backend centralizes validation, business rules, and integrations.
- Database preserves tailor-ready records with audit timestamps.

## Tech choice

- Frontend: HTML/CSS/Vanilla JS (fast to iterate for UX research)
- Backend: Node.js + Express + Zod + PostgreSQL driver
- Database: PostgreSQL (reliable relational model for real production use)

## Project tree

- `frontend/index.html`
- `frontend/meaning.html`
- `frontend/measurements.html`
- `frontend/styles.css`
- `frontend/script.js`
- `backend/package.json`
- `backend/.env.example`
- `backend/src/server.js`
- `backend/src/db.js`
- `backend/src/validation.js`
- `database/01_create_database.sql`
- `database/02_schema.sql`
- `docker-compose.yml`

## Run locally

### 1) Start database

```powershell
docker compose up -d
```

### 2) Start backend API

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

API base URL: `http://localhost:4000`

### 3) Start frontend

In a separate terminal:

```powershell
cd frontend
python -m http.server 5500
```

Open: `http://localhost:5500/measurements.html`

## Implemented backend endpoints

- `GET /api/health`
- `GET /api/measurements/definitions`
- `POST /api/measurements/submit`

## Next diploma-grade improvements

1. Add authentication and customer profiles.
2. Add tailor dashboard for approvals and re-measure requests.
3. Store measurement images/video evidence per step.
4. Add confidence scoring and duplicate-measure checks.
