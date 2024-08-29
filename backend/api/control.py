# api/control.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.control import Control as ControlModel
from schemas.control import ControlCreate, ControlRead

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/controls/", response_model=ControlRead)
def create_control(control: ControlCreate, db: Session = Depends(get_db)):
    db_control = ControlModel(**control.dict())
    db.add(db_control)
    db.commit()
    db.refresh(db_control)
    return db_control

@router.get("/controls/{control_id}", response_model=ControlRead)
def read_control(control_id: int, db: Session = Depends(get_db)):
    control = db.query(ControlModel).filter(ControlModel.id == control_id).first()
    if control is None:
        raise HTTPException(status_code=404, detail="Control not found")
    return control