# schemas/result.py
from pydantic import BaseModel
from typing import Optional
import datetime
class ResultCreate(BaseModel):
    profile_id: int
    result_json: str  # Store the entire JSON output as a string
    created_at: datetime.datetime

class ResultRead(BaseModel):
    id: int
    profile_id: int
    result_json: str  # Store the entire JSON output as a string
    created_at: datetime.datetime
    class Config:
        orm_mode = True
