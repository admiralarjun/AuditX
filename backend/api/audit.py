# api/audit.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.audit import Audit as AuditModel
from schemas.audit import AuditCreate, AuditRead

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/audits/", response_model=AuditRead)
def create_audit(audit: AuditCreate, db: Session = Depends(get_db)):
    db_audit = AuditModel(**audit.dict())
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit

@router.get("/audits/{audit_id}", response_model=AuditRead)
def read_audit(audit_id: int, db: Session = Depends(get_db)):
    audit = db.query(AuditModel).filter(AuditModel.id == audit_id).first()
    if audit is None:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit
