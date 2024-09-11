# models/platform.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Platform(Base):
    __tablename__ = 'platforms'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    release = Column(String)
    target_id = Column(Integer)
    
    winrm_creds_id = Column(Integer, ForeignKey('winrm_creds.id'), nullable=True)
    ssh_creds_id = Column(Integer, ForeignKey('ssh_creds.id'), nullable=True)
    
    winrm_creds = relationship("WinRMCreds", back_populates="platforms")
    ssh_creds = relationship("SSHCreds", back_populates="platforms")
