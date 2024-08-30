from pydantic import BaseModel
from typing import Optional

class PlatformCreate(BaseModel):
    name: str
    release: str
    target_id: int

class PlatformRead(BaseModel):
    id: int
    name: str
    release: str
    target_id: int

    class Config:
        orm_mode = True

class PlatformUpdate(BaseModel):
    name: Optional[str] = None
    release: Optional[str] = None
    target_id: Optional[int] = None

    class Config:
        orm_mode = True
