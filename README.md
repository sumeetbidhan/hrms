# HRMS Lite

A full-stack HR management web application for employee and attendance management. Clean, stable, and deployable to Vercel (frontend) and Render (backend + PostgreSQL).

## Tech Stack

| Layer      | Technologies                          |
| ---------- | ------------------------------------- |
| Frontend   | React (Vite), Bootstrap 5, Axios      |
| Backend    | FastAPI, SQLAlchemy ORM, Pydantic      |
| Database   | PostgreSQL                             |
| Server     | Uvicorn                                |
| Deployment | Frontend → Vercel, Backend/DB → Render |

## Project Structure

```
ethara/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, error handlers
│   │   ├── database.py      # SQLAlchemy engine, session
│   │   ├── models.py        # Employee, Attendance
│   │   ├── schemas.py       # Pydantic request/response
│   │   └── routes/
│   │       ├── employees.py
│   │       └── attendance.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (local or Docker)

### Backend

1. Create a virtual environment and install dependencies:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Copy environment file and set your database URL:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/hrms_lite
   ```

3. Run the API:

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Tables are created on startup via `Base.metadata.create_all()`.

### Frontend

1. Install dependencies and set API URL:

   ```bash
   cd frontend
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. Run the dev server:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:5173.

## Environment Variables

### Backend

| Variable       | Description                    | Example                          |
| -------------- | ------------------------------ | --------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string   | `postgresql://user:pass@host/db`  |

### Frontend

| Variable             | Description              | Example                          |
| -------------------- | ------------------------ | --------------------------------- |
| `VITE_API_BASE_URL`  | Backend API base URL     | `http://localhost:8000` or Render URL |

## Deployment

### Backend (Render)

1. Create a **Web Service** and connect your repo.
2. **Root Directory**: `backend`
3. **Runtime**: Python 3.12 (via `backend/.python-version`). If builds fail with Python 3.14, add env var `PYTHON_VERSION=3.12.7` in Render dashboard.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
6. **Environment**: Add `DATABASE_URL` from your Render PostgreSQL instance (Internal Database URL).

Render assigns port 10000 by default; use that in the start command.

### PostgreSQL (Render)

1. Create a **PostgreSQL** instance in Render.
2. Copy the **Internal Database URL** (or External if your backend is elsewhere).
3. Set it as `DATABASE_URL` in the backend Web Service.

### Frontend (Vercel)

1. Import the project and set **Root Directory** to `frontend`.
2. **Environment Variable**: `VITE_API_BASE_URL` = your Render backend URL (e.g. `https://your-app.onrender.com`).
3. Deploy. Vercel will run `npm run build` and serve the `dist` output.

Ensure the backend URL has no trailing slash (e.g. `https://hrms-lite-api.onrender.com`).

## API Overview

- **POST /employees** – Add employee (201, 409 on duplicate)
- **GET /employees** – List employees (200)
- **DELETE /employees/{employee_id}** – Delete employee (200, 404)
- **POST /attendance** – Mark attendance (201, 404 if employee missing, 409 if already marked)
- **GET /attendance?employee_id=** – List attendance, optional filter (200)
- **GET /health** – Health check (200)

All responses follow:

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... }
}
```

Errors use the same shape with `success: false` and appropriate status codes (400, 404, 409, 500).

## Assumptions

- **employee_id** is a unique business identifier (string); **id** is the internal primary key.
- Attendance **employee_id** in the API is the business `employee_id`; the DB stores the foreign key to `employees.id`.
- One attendance record per employee per day; duplicate date for same employee returns 409.
- Deleting an employee cascades to their attendance records.
- CORS is set to allow all origins for simplicity; you can restrict to your Vercel domain in production via `ALLOWED_ORIGINS`.
