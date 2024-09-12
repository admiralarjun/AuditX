# models/profile.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Profile(Base):
    __tablename__ = 'profiles'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    platform_id = Column(Integer, ForeignKey('platforms.id'))
    name = Column(String, index=True)
    winrm_creds_id = Column(Integer, ForeignKey('winrm_creds.id'), nullable=True)
    ssh_creds_id = Column(Integer, ForeignKey('ssh_creds.id'), nullable=True)
    
    # Define the relationship to the Platform model
    platform = relationship("Platform", back_populates="profiles")
    # Define the relationship to the Attribute model
    attributes = relationship("Attribute", back_populates="profile")

    # Define the relationship to the Control model
    controls = relationship("Control", back_populates="profile")

    # Define the relationship to the Result model
    results = relationship("Result", back_populates="profile")

    # Define the relationship to the Audit model
    audits = relationship("Audit", back_populates="profile")

    # Define the relationship to the WinRMCreds model
    winrm_creds = relationship("WinRMCreds", back_populates="profiles")
    # Define the relationship to the SSHCreds model
    ssh_creds = relationship("SSHCreds", back_populates="profiles")

