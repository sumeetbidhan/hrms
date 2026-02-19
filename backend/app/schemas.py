# backend/app/schemas.py
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, field_validator


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


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
