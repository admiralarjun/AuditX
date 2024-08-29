from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Control(Base):
    __tablename__ = 'controls'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    title = Column(String)
    description = Column(Text)
    impact = Column(Float)
    code = Column(Text)

    # Define the relationship to the Profile model
    profile = relationship("Profile", back_populates="controls")

    # Define the relationship to the Tag model
    tags = relationship("Tag", back_populates="control")

    # Define the relationship to the Reference model
    references = relationship("Reference", back_populates="control")

    # Define the relationship to the Audit model
    audits = relationship("Audit", back_populates="control")
