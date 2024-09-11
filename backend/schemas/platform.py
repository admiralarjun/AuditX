from pydantic import BaseModel
from typing import Optional, List
from schemas.winrm_creds import WinRMCredsRead
from schemas.ssh_creds import SSHCredsRead

class PlatformCreate(BaseModel):
    name: str
    release: str
    target_id: int
    winrm_creds_id: Optional[int] = None
    ssh_creds_id: Optional[int] = None

class PlatformRead(BaseModel):
    id: int
    name: str
    release: str
    target_id: int
    winrm_creds_id: Optional[int] = None
    ssh_creds_id: Optional[int] = None

    class Config:
        orm_mode = True

class PlatformUpdate(BaseModel):
    name: Optional[str] = None
    release: Optional[str] = None
    target_id: Optional[int] = None
    winrm_creds_id: Optional[int] = None
    ssh_creds_id: Optional[int] = None

    class Config:
        orm_mode = True
