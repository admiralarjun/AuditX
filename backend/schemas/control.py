# schemas/control.py
from pydantic import BaseModel
from typing import Optional

class ControlCreate(BaseModel):
    profile_id: int
    control_id: str
    title: str
    description: Optional[str] = None
    impact: Optional[float] = None
    code: Optional[str] = None

class ControlRead(BaseModel):
    id: int
    profile_id: int
    control_id: str
    title: str
    description: Optional[str] = None
    impact: Optional[float] = None
    code: Optional[str] = None

    class Config:
        orm_mode = True
