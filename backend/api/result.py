# api/result.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models.result import Result as ResultModel
from schemas.result import ResultCreate, ResultRead

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/results/", response_model=ResultRead)
def create_result(result: ResultCreate, db: Session = Depends(get_db)):
    db_result = ResultModel(**result.dict())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

@router.get("/results/{result_id}", response_model=ResultRead)
def read_result(result_id: int, db: Session = Depends(get_db)):
    result = db.query(ResultModel).filter(ResultModel.id == result_id).first()
    if result is None:
        raise HTTPException(status_code=404, detail="Result not found")
    return result
