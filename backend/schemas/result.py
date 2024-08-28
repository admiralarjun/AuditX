# schemas/result.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResultCreate(BaseModel):
    profile_id: int
    status: str
    code_desc: Optional[str] = None
    run_time: Optional[float] = None
    start_time: Optional[datetime] = None
    total_controls: Optional[int] = None
    passed_controls: Optional[int] = None
    failed_controls: Optional[int] = None
    message: Optional[str] = None
    resource_class: Optional[str] = None
    resource_params: Optional[str] = None
    resource_id: Optional[str] = None

class ResultRead(BaseModel):
    id: int
    profile_id: int
    status: str
    code_desc: Optional[str] = None
    run_time: Optional[float] = None
    start_time: Optional[datetime] = None
    total_controls: Optional[int] = None
    passed_controls: Optional[int] = None
    failed_controls: Optional[int] = None
    message: Optional[str] = None
    resource_class: Optional[str] = None
    resource_params: Optional[str] = None
    resource_id: Optional[str] = None

    class Config:
        orm_mode = True
