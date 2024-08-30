from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.platform import Platform as PlatformModel
from schemas.platform import PlatformCreate, PlatformRead
from typing import List

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/platforms/", response_model=PlatformRead)
def create_platform(platform: PlatformCreate, db: Session = Depends(get_db)):
    db_platform = PlatformModel(**platform.dict())
    db.add(db_platform)
    db.commit()
    db.refresh(db_platform)
    return db_platform

@router.get("/platforms/{platform_id}", response_model=PlatformRead)
def read_platform(platform_id: int, db: Session = Depends(get_db)):
    platform = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")
    return platform

@router.get("/platforms/", response_model=List[PlatformRead])
def get_all_platforms(db: Session = Depends(get_db)):
    platforms = db.query(PlatformModel).all()
    return platforms