from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from db import SessionLocal
from models.ssh_creds import SSHCreds as SSHCredsModel
from schemas.ssh_creds import SSHCredsCreate, SSHCredsRead
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

@router.post("/ssh_creds/", response_model=SSHCredsRead)
async def create_ssh_creds(
    ssh_creds: str = Form(...),
    db: Session = Depends(get_db),
    pem_file: UploadFile = File(None)
):
    try:
        ssh_creds_dict = json.loads(ssh_creds)
        ssh_creds_data = SSHCredsCreate(**ssh_creds_dict)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON for ssh_creds")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    db_ssh_creds = SSHCredsModel(**ssh_creds_data.dict())

    if pem_file:
        pem_file_path = f"uploads/pems/{pem_file.filename}"
        os.makedirs(os.path.dirname(pem_file_path), exist_ok=True)
        with open(pem_file_path, "wb") as f:
            f.write(await pem_file.read())
        db_ssh_creds.ssh_pem_path = pem_file_path

    db.add(db_ssh_creds)
    db.commit()
    db.refresh(db_ssh_creds)
    return db_ssh_creds