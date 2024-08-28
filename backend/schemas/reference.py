# schemas/reference.py
from pydantic import BaseModel
from typing import Optional

class ReferenceCreate(BaseModel):
    control_id: int
    name: str
    url: str

class ReferenceRead(BaseModel):
    id: int
    control_id: int
    name: str
    url: str

    class Config:
        orm_mode = True
