# schemas/profile.py
from pydantic import BaseModel
from typing import Optional

class ProfileCreate(BaseModel):
    platform_id: int
    name: str
    version: str
    path: str
    title: Optional[str] = None
    maintainer: Optional[str] = None
    summary: Optional[str] = None
    license: Optional[str] = None
    copyright: Optional[str] = None
    copyright_email: Optional[str] = None

class ProfileRead(BaseModel):
    id: int
    platform_id: int
    name: str
    version: str
    path: str
    title: Optional[str] = None
    maintainer: Optional[str] = None
    summary: Optional[str] = None
    license: Optional[str] = None
    copyright: Optional[str] = None
    copyright_email: Optional[str] = None

    class Config:
        orm_mode = True
