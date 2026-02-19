# backend/app/main.py
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException

from app.database import Base, engine
from app.routes import attendance, employees

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="HR Management System API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)


@app.get("/health")
def health():
    return {"success": True, "message": "OK", "data": {}}


@app.exception_handler(HTTPException)
def http_exception_handler(request, exc):
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": detail, "data": {}},
    )


@app.exception_handler(RequestValidationError)
def validation_exception_handler(request, exc):
    errors = exc.errors()
    msg = "; ".join(f"{e.get('loc', [])[-1]}: {e.get('msg', '')}" for e in errors)
    return JSONResponse(
        status_code=400,
        content={"success": False, "message": msg or "Validation error", "data": {}},
    )


@app.exception_handler(Exception)
def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error", "data": {}},
    )
