import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
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

@router.post("/cis_pdfs/", response_model=CISPDFRead, status_code=status.HTTP_201_CREATED)
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

@router.put("/cis_pdfs/{cis_pdf_id}", response_model=CISPDFRead)
async def update_cis_pdf(cis_pdf_id: int, pdf_title: str = None, tag: str = None, pdf_file: UploadFile = File(None), db: Session = Depends(get_db)):
    # Fetch the existing CISPDF record
    cis_pdf = db.query(CISPDFModel).filter(CISPDFModel.id == cis_pdf_id).first()
    if cis_pdf is None:
        raise HTTPException(status_code=404, detail="CIS PDF not found")

    # Update the title, tag, and file path if provided
    if pdf_title:
        cis_pdf.pdf_title = pdf_title
    if tag:
        cis_pdf.tag = tag
    if pdf_file:
        # Delete the old file if a new one is uploaded
        if os.path.exists(cis_pdf.pdf_path):
            os.remove(cis_pdf.pdf_path)
        
        # Generate a unique filename using uuid
        unique_filename = f"{uuid.uuid4()}_{pdf_file.filename}"
        pdf_file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # Save the new PDF file to the server
        with open(pdf_file_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)
        
        cis_pdf.pdf_path = pdf_file_path

    db.commit()
    db.refresh(cis_pdf)

    return cis_pdf

@router.delete("/cis_pdfs/{cis_pdf_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cis_pdf(cis_pdf_id: int, db: Session = Depends(get_db)):
    # Fetch the existing CISPDF record
    cis_pdf = db.query(CISPDFModel).filter(CISPDFModel.id == cis_pdf_id).first()
    if cis_pdf is None:
        raise HTTPException(status_code=404, detail="CIS PDF not found")

    # Delete the associated file
    if os.path.exists(cis_pdf.pdf_path):
        os.remove(cis_pdf.pdf_path)

    # Delete the CISPDF record from the database
    db.delete(cis_pdf)
    db.commit()

    return None

@router.get("/cis_pdfs/", response_model=list[CISPDFRead])
def list_cis_pdfs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    cis_pdfs = db.query(CISPDFModel).offset(skip).limit(limit).all()
    return cis_pdfs
