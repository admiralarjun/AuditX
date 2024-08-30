# schemas/result.py
from pydantic import BaseModel
from typing import Optional

class ResultCreate(BaseModel):
    profile_id: int
    result_json: str  # Store the entire JSON output as a string

class ResultRead(BaseModel):
    id: int
    profile_id: int
    result_json: str  # Store the entire JSON output as a string

    class Config:
        orm_mode = True
