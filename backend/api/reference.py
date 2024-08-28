# api/reference.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.reference import Reference as ReferenceModel
from schemas.reference import ReferenceCreate, ReferenceRead

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/references/", response_model=ReferenceRead)
def create_reference(reference: ReferenceCreate, db: Session = Depends(get_db)):
    db_reference = ReferenceModel(**reference.dict())
    db.add(db_reference)
    db.commit()
    db.refresh(db_reference)
    return db_reference

@router.get("/references/{reference_id}", response_model=ReferenceRead)
def read_reference(reference_id: int, db: Session = Depends(get_db)):
    reference = db.query(ReferenceModel).filter(ReferenceModel.id == reference_id).first()
    if reference is None:
        raise HTTPException(status_code=404, detail="Reference not found")
    return reference
