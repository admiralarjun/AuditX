from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from db import SessionLocal
from models.ssh_creds import SSHCreds as SSHCredsModel
from schemas.ssh_creds import SSHCredsRead
import os
import uuid

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/ssh_creds/", response_model=SSHCredsRead)
async def create_ssh_creds(
    ssh_username: str = Form(...),
    ssh_ip: str = Form(...),
    ssh_password: str = Form(None),
    db: Session = Depends(get_db),
    pem_file: UploadFile = File(None)
):
    db_ssh_creds = SSHCredsModel(
        ssh_username=ssh_username,
        ssh_ip=ssh_ip,
        ssh_password=ssh_password
    )

    if pem_file:
        # Validate file extension
        if not pem_file.filename.endswith('.pem'):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .pem file.")
        
        # Generate a unique filename to prevent overwriting
        unique_filename = f"{uuid.uuid4()}_{pem_file.filename}"
        pem_file_path = f"uploads/pems/{unique_filename}"
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(pem_file_path), exist_ok=True)
        
        try:
            # Save the file to the server's file system
            with open(pem_file_path, "wb") as f:
                f.write(await pem_file.read())
            db_ssh_creds.ssh_pem_path = pem_file_path
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save PEM file: {str(e)}")
    
    db.add(db_ssh_creds)
    db.commit()
    db.refresh(db_ssh_creds)
    return db_ssh_creds

@router.get("/ssh_creds/{ssh_creds_id}", response_model=SSHCredsRead)
def read_ssh_creds(ssh_creds_id: int, db: Session = Depends(get_db)):
    ssh_creds = db.query(SSHCredsModel).filter(SSHCredsModel.id == ssh_creds_id).first()
    if ssh_creds is None:
        raise HTTPException(status_code=404, detail="SSH Credentials not found")
    return ssh_creds
