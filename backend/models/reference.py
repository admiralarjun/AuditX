# models/reference.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class Reference(Base):
    __tablename__ = 'references'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    control_id = Column(Integer, ForeignKey('controls.id'))
    name = Column(String)
    url = Column(String)

    # Define the relationship to the Control model
    control = relationship("Control", back_populates="references")
