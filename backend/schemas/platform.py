from pydantic import BaseModel, Field, validator
from typing import Optional, List
from schemas.winrm_creds import WinRMCredsRead
from schemas.ssh_creds import SSHCredsRead

class PlatformCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    release: str = Field(..., min_length=1, max_length=255)
    target_id: int = Field(..., gt=0)
    winrm_creds_id: Optional[int] = Field(None, gt=0)
    ssh_creds_id: Optional[int] = Field(None, gt=0)

    @validator('name', 'release')
    def check_string_fields(cls, v):
        if not isinstance(v, str) or not v.strip():
            raise ValueError("Must be a non-empty string")
        return v.strip()

class PlatformRead(PlatformCreate):
    id: int

    class Config:
        orm_mode = True

class PlatformUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    release: Optional[str] = Field(None, min_length=1, max_length=255)
    target_id: Optional[int] = Field(None, gt=0)
    winrm_creds_id: Optional[int] = Field(None, gt=0)
    ssh_creds_id: Optional[int] = Field(None, gt=0)

    class Config:
        orm_mode = True
