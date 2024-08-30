from sqlalchemy import Column, Integer, String
from db import Base

class CISPDF(Base):
    __tablename__ = 'cis_pdfs'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pdf_title = Column(String, index=True)
    pdf_path = Column(String)
    tag = Column(String)

    # You can add relationships or other fields if necessary
