# models/result.py
from sqlalchemy import Column, Integer, String, Text, Float, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Result(Base):
    __tablename__ = 'results'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    status = Column(String)
    code_desc = Column(Text)
    run_time = Column(Float)
    start_time = Column(TIMESTAMP)
    total_controls = Column(Integer)
    passed_controls = Column(Integer)
    failed_controls = Column(Integer)
    message = Column(Text)
    resource_class = Column(String)
    resource_params = Column(Text)
    resource_id = Column(String)

    # Define the relationship to the Profile model
    profile = relationship("Profile", back_populates="results")

    # Define the relationship to the Audit model
    audits = relationship("Audit", back_populates="result")
