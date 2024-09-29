# models/result.py
import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from db import Base

class Result(Base):
    __tablename__ = 'results'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    result_json = Column(Text)  # Store the entire JSON output as a string

    created_at = Column(DateTime, default=datetime.datetime.now)

    # Define the relationship to the Profile model
    profile = relationship("Profile", back_populates="results")

    # Define the relationship to the Audit model
    audits = relationship("Audit", back_populates="result")
