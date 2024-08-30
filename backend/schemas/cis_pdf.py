from pydantic import BaseModel

class CISPDFCreate(BaseModel):
    pdf_title: str
    pdf_path: str
    tag: str

class CISPDFRead(BaseModel):
    id: int
    pdf_title: str
    pdf_path: str
    tag: str

    class Config:
        orm_mode = True
