# schemas/ssh_creds.py
from pydantic import BaseModel
from typing import Optional

class SSHCredsCreate(BaseModel):
    ssh_username: str
    ssh_password: Optional[str] = None
    ssh_pem_path: Optional[str] = None
    ssh_ip: str

class SSHCredsRead(BaseModel):
    id: int
    ssh_username: str
    ssh_password: Optional[str] = None
    ssh_pem_path: Optional[str] = None
    ssh_ip: str

    class Config:
        orm_mode = True

class SSHCredsUpdate(BaseModel):
    ssh_username: Optional[str] = None
    ssh_password: Optional[str] = None
    ssh_pem_path: Optional[str] = None
    ssh_ip: Optional[str] = None