# schemas/profile.py
from pydantic import BaseModel
from typing import Optional

class ProfileCreate(BaseModel):
    platform_id: int
    name: str

class ProfileRead(BaseModel):
    id: int
    platform_id: int
    name: str

    class Config:
        orm_mode = True

class ProfileUpdate(BaseModel):
    platform_id: Optional[int] = None
    name: Optional[str] = None
