from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class WinRMCreds(Base):
    __tablename__ = 'winrm_creds'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    winrm_username = Column(String, nullable=False)
    winrm_password = Column(String, nullable=False)
    winrm_hostname = Column(String, nullable=False)
    winrm_port = Column(Integer, nullable=False, default=5986)
    use_ssl = Column(Boolean, nullable=False, default=True)

    profiles = relationship("Profile", back_populates="winrm_creds")
