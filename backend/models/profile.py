from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from db import Base
import enum

class CredsType(enum.Enum):
    winrm = "winrm"
    ssh = "ssh"
    none = "none"

class Profile(Base):
    __tablename__ = 'profiles'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    platform_id = Column(Integer, ForeignKey('platforms.id'))
    name = Column(String, index=True)
    creds_type = Column(Enum(CredsType), index=True)  # winrm or ssh
    creds_id = Column(Integer, nullable=True)  # Generic credential ID, either for winrm or ssh
    
    # Relationships with other models
    platform = relationship("Platform", back_populates="profiles")
    attributes = relationship("Attribute", back_populates="profile")
    controls = relationship("Control", back_populates="profile")
    results = relationship("Result", back_populates="profile")
    audits = relationship("Audit", back_populates="profile")

    # Hybrid property to fetch the appropriate credential based on creds_type
    @hybrid_property
    def credentials(self):
        if self.creds_type == CredsType.winrm:
            return self.winrm_creds
        elif self.creds_type == CredsType.ssh:
            return self.ssh_creds
        return None

    # Optional: A method to set the appropriate credential ID and type together
    def set_credentials(self, creds_type, creds_id):
        self.creds_type = creds_type
        self.creds_id = creds_id
