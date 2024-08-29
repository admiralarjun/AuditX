# models/ssh_creds.py
from sqlalchemy import Column, Integer, String
from db import Base

class SSHCreds(Base):
    __tablename__ = 'ssh_creds'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ssh_username = Column(String, nullable=False)
    ssh_password = Column(String, nullable=True)
    ssh_pem_path = Column(String, nullable=True)
    ssh_ip = Column(String, nullable=False)
