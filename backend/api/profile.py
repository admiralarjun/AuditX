from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from db import SessionLocal
from models.profile import Profile as ProfileModel
from schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate
from models.profile import CredsType

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/profiles/", response_model=ProfileRead)
def create_profile(
    platform_id: int = Form(...),
    name: str = Form(...),
    creds_type: Optional[CredsType] = Form(CredsType.none),
    creds_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # If creds_type is 'none', ensure creds_id is None
        if creds_type == CredsType.none:
            creds_id = None

        db_profile = ProfileModel(
            platform_id=platform_id,
            name=name,
            creds_type=creds_type,
            creds_id=creds_id
        )
        
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profiles/", response_model=List[ProfileRead])
def read_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        profiles = db.query(ProfileModel).offset(skip).limit(limit).all()
        return profiles
    except Exception as e:
        print(f"Error fetching profiles: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/profiles/{profile_id}", response_model=ProfileRead)
def read_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profiles/{profile_id}", response_model=ProfileRead)
def update_profile(
    profile_id: int,
    platform_id: Optional[int] = Form(None),
    name: Optional[str] = Form(None),
    creds_type: Optional[CredsType] = Form(None),
    creds_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    db_profile = db.query(ProfileModel).filter(ProfileModel.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = {
        "platform_id": platform_id,
        "name": name,
        "creds_type": creds_type,
        "creds_id": creds_id
    }
    for key, value in update_data.items():
        if value is not None:
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