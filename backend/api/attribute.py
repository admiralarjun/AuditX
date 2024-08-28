# routes/attribute.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.attribute import Attribute as AttributeModel
from schemas.attribute import AttributeCreate, AttributeRead

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/attributes/", response_model=AttributeRead)
def create_attribute(attribute: AttributeCreate, db: Session = Depends(get_db)):
    db_attribute = AttributeModel(**attribute.dict())
    db.add(db_attribute)
    db.commit()
    db.refresh(db_attribute)
    return db_attribute

@router.get("/attributes/{attribute_id}", response_model=AttributeRead)
def read_attribute(attribute_id: int, db: Session = Depends(get_db)):
    attribute = db.query(AttributeModel).filter(AttributeModel.id == attribute_id).first()
    if attribute is None:
        raise HTTPException(status_code=404, detail="Attribute not found")
    return attribute
