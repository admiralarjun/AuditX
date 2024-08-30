from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import SessionLocal
from models.control import Control as ControlModel
from schemas.control import ControlCreate, ControlRead, ControlUpdate

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

@router.get("/controls/", response_model=List[ControlRead])
def read_controls(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    controls = db.query(ControlModel).offset(skip).limit(limit).all()
    return controls

@router.get("/controls/profile/{profile_id}", response_model=List[ControlRead])
def read_controls_by_profile(profile_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    controls = db.query(ControlModel).filter(ControlModel.profile_id == profile_id).offset(skip).limit(limit).all()
    return controls

@router.get("/controls/{id}", response_model=ControlRead)
def read_control(id: int, db: Session = Depends(get_db)):
    control = db.query(ControlModel).filter(ControlModel.id == id).first()
    if control is None:
        raise HTTPException(status_code=404, detail="Control not found")
    return control

@router.put("/controls/{id}", response_model=ControlRead)
def update_control(id: int, control: ControlUpdate, db: Session = Depends(get_db)):
    db_control = db.query(ControlModel).filter(ControlModel.id == id).first()
    if db_control is None:
        raise HTTPException(status_code=404, detail="Control not found")
    
    for key, value in control.dict(exclude_unset=True).items():
        setattr(db_control, key, value)
    
    db.commit()
    db.refresh(db_control)
    return db_control

@router.delete("/controls/{id}", response_model=ControlRead)
def delete_control(id: int, db: Session = Depends(get_db)):
    control = db.query(ControlModel).filter(ControlModel.id == id).first()
    if control is None:
        raise HTTPException(status_code=404, detail="Control not found")
    
    db.delete(control)
    db.commit()
    return control
