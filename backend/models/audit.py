# models/audit.py
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Audit(Base):
    __tablename__ = 'audits'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_type = Column(String, nullable=False)
    event_timestamp = Column(TIMESTAMP, nullable=False)
    profile_id = Column(Integer, ForeignKey('profiles.id'), nullable=False)
    description = Column(Text)
    summary_text = Column(Text)
    control_id = Column(Integer, ForeignKey('controls.id'), nullable=False)
    result_id = Column(Integer, ForeignKey('results.id'), nullable=False)
    status = Column(String)
    message = Column(Text)
    created_at = Column(TIMESTAMP)

    # Define the relationships
    profile = relationship("Profile", back_populates="audits")
    control = relationship("Control", back_populates="audits")
    result = relationship("Result", back_populates="audits")
