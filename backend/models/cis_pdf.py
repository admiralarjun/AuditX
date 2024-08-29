from sqlalchemy import Column, Integer, String
from db import Base
import json

class PDF(Base):
    __tablename__ = 'pdfs'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    pdf_path = Column(String, nullable=False)
    tags = Column(String, nullable=True)  # Store as JSON string

    @property
    def tags_list(self):
        return json.loads(self.tags) if self.tags else []

    @tags_list.setter
    def tags_list(self, tags):
        self.tags = json.dumps(tags)
