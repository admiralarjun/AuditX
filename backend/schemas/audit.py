# schemas/audit.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditCreate(BaseModel):
    event_type: str
    event_timestamp: datetime
    profile_id: int
    description: Optional[str] = None
    summary_text: Optional[str] = None
    control_id: int
    result_id: int
    status: Optional[str] = None
    message: Optional[str] = None
    created_at: Optional[datetime] = None

class AuditRead(BaseModel):
    id: int
    event_type: str
    event_timestamp: datetime
    profile_id: int
    description: Optional[str] = None
    summary_text: Optional[str] = None
    control_id: int
    result_id: int
    status: Optional[str] = None
    message: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
