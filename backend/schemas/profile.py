# schemas/profile.py
from pydantic import BaseModel, Field
from typing import Optional

class ProfileCreate(BaseModel):
    platform_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1, max_length=255)
    winrm_creds_id: Optional[int] = Field(None, gt=0)
    ssh_creds_id: Optional[int] = Field(None, gt=0)

class ProfileRead(BaseModel):
    id: int
    platform_id: int
    name: str
    winrm_creds_id: Optional[int] = None
    ssh_creds_id: Optional[int] = None

    class Config:
        orm_mode = True

class ProfileUpdate(BaseModel):
    platform_id: Optional[int] = Field(None, gt=0)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    winrm_creds_id: Optional[int] = Field(None, gt=0)
    ssh_creds_id: Optional[int] = Field(None, gt=0)
