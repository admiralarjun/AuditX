from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db import Base

class Platform(Base):
    __tablename__ = 'platforms'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    release = Column(String)
    target_id = Column(Integer)
    
    profiles = relationship("Profile", back_populates="platform")