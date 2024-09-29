from fastapi import FastAPI, HTTPException, Request, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import base64
import subprocess
import uuid
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from db import SessionLocal, init_db
from api.platform import router as platform_router
from api.profile import router as profile_router
from api.attribute import router as attribute_router
from api.control import router as control_router
from api.tag import router as tag_router
from api.reference import router as reference_router
from api.audit import router as audit_router
from api.result import router as result_router
from api.ssh_creds import router as ssh_creds_router
from api.cis_pdf import router as cis_pdf_router
from api.winrm_creds import router as winrm_creds_router

from copilot import router as copilot_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(copilot_router, prefix="/copilot")

controls_dir = "./controls"
results_dir = "./results"

# Ensure results directory exists
os.makedirs(results_dir, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# nafi added

# Initialize the database
init_db()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# app.include_router(api_router)
app.include_router(platform_router)
app.include_router(profile_router)
app.include_router(attribute_router)
app.include_router(control_router)
app.include_router(tag_router)
app.include_router(reference_router)
app.include_router(audit_router)
app.include_router(result_router)
app.include_router(ssh_creds_router)
app.include_router(cis_pdf_router)
app.include_router(winrm_creds_router)