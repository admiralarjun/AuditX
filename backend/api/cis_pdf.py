from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from db import SessionLocal
from models.cis_pdf import PDF as PDFModel
from schemas.cis_pdf import PDFCreate, PDFRead
import os
import json

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/pdfs/", response_model=PDFRead)
async def create_pdf(title: str = Form(...), tags: str = Form(None), pdf_file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Create the directory for PDF uploads if it doesn't exist
    pdf_path = f"uploads/pdfs/{pdf_file.filename}"
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

    # Write the PDF file to the specified path
    with open(pdf_path, "wb") as f:
        f.write(await pdf_file.read())

    # Safely handle tags input
    tags_list = []
    if tags:
        try:
            tags_list = json.loads(tags)
            if not isinstance(tags_list, list):
                tags_list = [tags_list]
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format for tags")

    # Create the PDF entry in the database
    db_pdf = PDFModel(
        title=title,
        pdf_path=pdf_path,
        tags=json.dumps(tags_list)  # Serialize tags to JSON
    )

    # Add the entry to the database and commit
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    
    # Deserialize tags for response
    db_pdf.tags = json.loads(db_pdf.tags)

    return db_pdf

@router.get("/pdfs/{pdf_id}", response_model=PDFRead)
def read_pdf(pdf_id: int, db: Session = Depends(get_db)):
    # Fetch the PDF entry from the database
    pdf = db.query(PDFModel).filter(PDFModel.id == pdf_id).first()
    
    # Raise a 404 error if the PDF is not found
    if pdf is None:
        raise HTTPException(status_code=404, detail="PDF not found")

    # Deserialize tags for response
    pdf.tags = json.loads(pdf.tags)
    
    # Return the PDF entry
    return pdf
