# models/result.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Result(Base):
    __tablename__ = 'results'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    result_json = Column(Text)  # Store the entire JSON output as a string

    # Define the relationship to the Profile model
    profile = relationship("Profile", back_populates="results")

    # Define the relationship to the Audit model
    audits = relationship("Audit", back_populates="result")
