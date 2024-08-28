from pydantic import BaseModel

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
