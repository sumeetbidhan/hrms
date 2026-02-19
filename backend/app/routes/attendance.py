# backend/app/routes/attendance.py
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Attendance, Employee
from app.schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("", status_code=201)
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.employee_id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    existing = (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee.id, Attendance.date == payload.date)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Attendance already marked for this date")
    att = Attendance(
        employee_id=employee.id,
        date=payload.date,
        status=payload.status,
    )
    db.add(att)
    db.commit()
    db.refresh(att)
    return {
        "success": True,
        "message": "Attendance marked",
        "data": AttendanceResponse.model_validate(att),
    }


@router.get("")
def view_attendance(
    employee_id: str | None = Query(None, description="Filter by employee_id"),
    db: Session = Depends(get_db),
):
    query = db.query(Attendance).join(Employee)
    if employee_id:
        query = query.filter(Employee.employee_id == employee_id)
    records = query.order_by(Attendance.date.desc(), Attendance.created_at.desc()).all()
    out = []
    for r in records:
        item = AttendanceResponse.model_validate(r)
        d = item.model_dump()
        d["employee_employee_id"] = r.employee.employee_id
        d["employee_full_name"] = r.employee.full_name
        out.append(d)
    return {
        "success": True,
        "message": "Attendance retrieved",
        "data": out,
    }
