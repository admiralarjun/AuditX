from pydantic import BaseModel, Field
from typing import Optional
from models.profile import CredsType  # Import the CredsType enum

class ProfileCreate(BaseModel):
    platform_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1, max_length=255)
    creds_type: Optional[CredsType] = Field(CredsType.none)  # Use CredsType enum
    creds_id: Optional[int] = Field(None, gt=0)  # Allow creds_id to be null

class ProfileRead(BaseModel):
    id: int
    platform_id: int
    name: str
    creds_type: Optional[CredsType] = None  # Use CredsType enum
    creds_id: Optional[int] = None

    class Config:
        orm_mode = True

class ProfileUpdate(BaseModel):
    platform_id: Optional[int] = Field(None, gt=0)
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    creds_type: Optional[CredsType] = Field(None)  # Use CredsType enum
    creds_id: Optional[int] = Field(None, gt=0)  # Allow creds_id to be null