# api/profile.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import SessionLocal
from models.profile import Profile as ProfileModel
from schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/profiles/", response_model=ProfileRead)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    db_profile = ProfileModel(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/profiles/", response_model=List[ProfileRead])
def read_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    profiles = db.query(ProfileModel).offset(skip).limit(limit).all()
    return profiles

@router.get("/profiles/{profile_id}", response_model=ProfileRead)
def read_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profiles/{profile_id}", response_model=ProfileRead)
def update_profile(profile_id: int, profile: ProfileUpdate, db: Session = Depends(get_db)):
    db_profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    for key, value in profile.dict(exclude_unset=True).items():
        setattr(db_profile, key, value)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.delete("/profiles/{profile_id}", response_model=ProfileRead)
def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(db_profile)
    db.commit()
    return db_profile