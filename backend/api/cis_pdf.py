import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from db import SessionLocal
from models.cis_pdf import CISPDF as CISPDFModel
from schemas.cis_pdf import CISPDFCreate, CISPDFRead

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads/pdfs"

@router.post("/cis_pdfs/", response_model=CISPDFRead)
async def create_cis_pdf(pdf_title: str, tag: str, pdf_file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Ensure the upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Generate a unique filename using uuid
    unique_filename = f"{uuid.uuid4()}_{pdf_file.filename}"
    pdf_file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the uploaded PDF file to the server
    with open(pdf_file_path, "wb") as buffer:
        shutil.copyfileobj(pdf_file.file, buffer)
    
    # Create CISPDF entry in the database
    cis_pdf = CISPDFModel(pdf_title=pdf_title, pdf_path=pdf_file_path, tag=tag)
    db.add(cis_pdf)
    db.commit()
    db.refresh(cis_pdf)
    
    return cis_pdf

@router.get("/cis_pdfs/{cis_pdf_id}", response_model=CISPDFRead)
def read_cis_pdf(cis_pdf_id: int, db: Session = Depends(get_db)):
    cis_pdf = db.query(CISPDFModel).filter(CISPDFModel.id == cis_pdf_id).first()
    if cis_pdf is None:
        raise HTTPException(status_code=404, detail="CIS PDF not found")
    return cis_pdf
