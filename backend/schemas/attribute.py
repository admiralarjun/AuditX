# schemas/attribute.py
from pydantic import BaseModel
from typing import Optional

class AttributeCreate(BaseModel):
    profile_id: int
    name: str
    type: str
    required: bool = False
    value: Optional[str] = None

class AttributeRead(BaseModel):
    id: int
    profile_id: int
    name: str
    type: str
    required: bool
    value: Optional[str] = None

    class Config:
        orm_mode = True
