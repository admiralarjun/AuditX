# schemas/tag.py
from pydantic import BaseModel
from typing import Optional

class TagCreate(BaseModel):
    control_id: int
    key: str
    value: str

class TagRead(BaseModel):
    id: int
    control_id: int
    key: str
    value: str

    class Config:
        orm_mode = True
