from pydantic import BaseModel
from typing import Optional

class WinRMCredsCreate(BaseModel):
    winrm_username: str
    winrm_password: str
    winrm_hostname: str
    winrm_port: int = 5986
    use_ssl: bool = True

class WinRMCredsRead(BaseModel):
    id: int
    winrm_username: str
    winrm_password: str
    winrm_hostname: str
    winrm_port: int
    use_ssl: bool

    class Config:
        orm_mode = True

class WinRMCredsUpdate(BaseModel):
    winrm_username: Optional[str] = None
    winrm_password: Optional[str] = None
    winrm_hostname: Optional[str] = None
    winrm_port: Optional[int] = None
    use_ssl: Optional[bool] = None