# models/tag.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    control_id = Column(Integer, ForeignKey('controls.id'))
    key = Column(String, index=True)
    value = Column(String)

    # Define the relationship to the Control model
    control = relationship("Control", back_populates="tags")
