# api/winrm_creds.py - API routes for WinRM Credentials
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from db import SessionLocal
from models.winrm_creds import WinRMCreds as WinRMCredsModel
from schemas.winrm_creds import WinRMCredsRead, WinRMCredsCreate, WinRMCredsUpdate
from typing import List

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/winrm_creds/", response_model=WinRMCredsRead)
def create_winrm_creds(
    winrm_username: str = Form(...),
    winrm_password: str = Form(...),
    winrm_hostname: str = Form(...),
    winrm_port: int = Form(5986),  # Default WinRM SSL port
    use_ssl: bool = Form(True),
    db: Session = Depends(get_db)
):
    db_winrm_creds = WinRMCredsModel(
        winrm_username=winrm_username,
        winrm_password=winrm_password,
        winrm_hostname=winrm_hostname,
        winrm_port=winrm_port,
        use_ssl=use_ssl
    )
    db.add(db_winrm_creds)
    db.commit()
    db.refresh(db_winrm_creds)
    return db_winrm_creds

@router.get("/winrm_creds/", response_model=List[WinRMCredsRead])
def read_all_winrm_creds(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    winrm_creds = db.query(WinRMCredsModel).offset(skip).limit(limit).all()
    return winrm_creds

@router.get("/winrm_creds/{winrm_creds_id}", response_model=WinRMCredsRead)
def read_winrm_creds(winrm_creds_id: int, db: Session = Depends(get_db)):
    winrm_creds = db.query(WinRMCredsModel).filter(WinRMCredsModel.id == winrm_creds_id).first()
    if winrm_creds is None:
        raise HTTPException(status_code=404, detail="WinRM Credentials not found")
    return winrm_creds

@router.put("/winrm_creds/{winrm_creds_id}", response_model=WinRMCredsRead)
def update_winrm_creds(
    winrm_creds_id: int,
    winrm_username: str = Form(None),
    winrm_password: str = Form(None),
    winrm_hostname: str = Form(None),
    winrm_port: int = Form(None),
    use_ssl: bool = Form(None),
    db: Session = Depends(get_db)
):
    db_winrm_creds = db.query(WinRMCredsModel).filter(WinRMCredsModel.id == winrm_creds_id).first()
    if db_winrm_creds is None:
        raise HTTPException(status_code=404, detail="WinRM Credentials not found")

    if winrm_username:
        db_winrm_creds.winrm_username = winrm_username
    if winrm_password:
        db_winrm_creds.winrm_password = winrm_password
    if winrm_hostname:
        db_winrm_creds.winrm_hostname = winrm_hostname
    if winrm_port is not None:
        db_winrm_creds.winrm_port = winrm_port
    if use_ssl is not None:
        db_winrm_creds.use_ssl = use_ssl

    db.commit()
    db.refresh(db_winrm_creds)
    return db_winrm_creds

@router.delete("/winrm_creds/{winrm_creds_id}", response_model=WinRMCredsRead)
def delete_winrm_creds(winrm_creds_id: int, db: Session = Depends(get_db)):
    db_winrm_creds = db.query(WinRMCredsModel).filter(WinRMCredsModel.id == winrm_creds_id).first()
    if db_winrm_creds is None:
        raise HTTPException(status_code=404, detail="WinRM Credentials not found")

    db.delete(db_winrm_creds)
    db.commit()
    return db_winrm_creds