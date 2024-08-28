# models/attribute.py
from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Attribute(Base):
    __tablename__ = 'attributes'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    name = Column(String, index=True)
    type = Column(String)
    required = Column(Boolean, default=False)
    value = Column(Text)

    # Define the relationship to the Profile model
    profile = relationship("Profile", back_populates="attributes")
