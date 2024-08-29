from pydantic import BaseModel
from typing import List

class PDFCreate(BaseModel):
    title: str
    tags: List[str]
    pdf_path: str

class PDFRead(BaseModel):
    id: int
    title: str
    tags: List[str]
    pdf_path: str

    class Config:
        orm_mode = True
