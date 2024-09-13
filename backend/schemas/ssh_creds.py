from pydantic import BaseModel
from typing import Optional

class SSHCredsRead(BaseModel):
    id: int
    ssh_username: str
    ssh_hostname: str
    ssh_port: int
    ssh_pem_path: Optional[str] = None

    class Config:
        orm_mode = True

class SSHCredsCreate(BaseModel):
    ssh_username: str
    ssh_password: Optional[str] = None
    ssh_hostname: str
    ssh_port: Optional[int] = 22
    ssh_pem_path: Optional[str] = None

class SSHCredsUpdate(BaseModel):
    ssh_username: Optional[str] = None
    ssh_password: Optional[str] = None
    ssh_hostname: Optional[str] = None
    ssh_port: Optional[int] = None
    ssh_pem_path: Optional[str] = None
