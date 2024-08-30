from pydantic import BaseModel
from typing import Optional

class ControlCreate(BaseModel):
    profile_id: int
    title: str
    description: Optional[str] = None
    impact: Optional[float] = None
    code: Optional[str] = None

class ControlRead(BaseModel):
    id: int
    profile_id: int
    title: str
    description: Optional[str] = None
    impact: Optional[float] = None
    code: Optional[str] = None

    class Config:
        orm_mode = True

class ControlUpdate(BaseModel):
    profile_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    impact: Optional[float] = None
    code: Optional[str] = None

    class Config:
        orm_mode = True
