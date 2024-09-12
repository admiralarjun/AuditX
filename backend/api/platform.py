from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from db import SessionLocal
from models.platform import Platform as PlatformModel
from schemas.platform import PlatformRead, PlatformUpdate
from typing import List, Optional

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/platforms/", response_model=PlatformRead)
def create_platform(
    name: str = Form(...),
    release: str = Form(...),
    target_id: int = Form(...),
    db: Session = Depends(get_db)
):
    try:
        db_platform = PlatformModel(
            name=name,
            release=release,
            target_id=target_id
        )
        
        db.add(db_platform)
        db.commit()
        db.refresh(db_platform)
        return db_platform
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/platforms/{platform_id}", response_model=PlatformRead)
def read_platform(platform_id: int, db: Session = Depends(get_db)):
    platform = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")
    return platform

@router.get("/platforms/", response_model=List[PlatformRead])
def get_all_platforms(db: Session = Depends(get_db)):
    try:
        platforms = db.query(PlatformModel).all()
        return platforms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching platforms: {str(e)}")

@router.put("/platforms/{platform_id}", response_model=PlatformRead)
def update_platform(platform_id: int, platform: PlatformUpdate, db: Session = Depends(get_db)):
    db_platform = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
    if db_platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")
    
    update_data = platform.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_platform, key, value)
    
    db.commit()
    db.refresh(db_platform)
    return db_platform

@router.delete("/platforms/{platform_id}", response_model=PlatformRead)
def delete_platform(platform_id: int, db: Session = Depends(get_db)):
    platform = db.query(PlatformModel).filter(PlatformModel.id == platform_id).first()
    if platform is None:
        raise HTTPException(status_code=404, detail="Platform not found")
    db.delete(platform)
    db.commit()
    return platform