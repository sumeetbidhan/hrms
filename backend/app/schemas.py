# backend/app/schemas.py
import re
from datetime import date, datetime
from pydantic import BaseModel, field_validator

EMAIL_RE = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        if not EMAIL_RE.match(v):
            raise ValueError("invalid email format")
        return v


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: str

    @field_validator("status")
    @classmethod
    def status_must_be_present_or_absent(cls, v: str) -> str:
        if v not in ("Present", "Absent"):
            raise ValueError('status must be "Present" or "Absent"')
        return v


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceWithEmployee(AttendanceResponse):
    employee_employee_id: str | None = None
    employee_full_name: str | None = None

    class Config:
        from_attributes = True
