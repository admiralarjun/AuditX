from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from db import SessionLocal
from models.result import Result as ResultModel
from schemas.result import ResultCreate, ResultRead
from models.control import Control as ControlModel
from pydantic import BaseModel
from typing import List
import subprocess
import uuid

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ExecuteControlsRequest(BaseModel):
    selected_controls: List[int]

@router.post("/execute_controls/{profile_id}")
async def execute_controls(profile_id: int, request: ExecuteControlsRequest, db: Session = Depends(get_db)):
    selected_controls = request.selected_controls
    
    # Fetch controls from the database
    controls = db.query(ControlModel).filter(ControlModel.profile_id == profile_id).all()

    if not controls:
        raise HTTPException(status_code=404, detail="No controls found for this profile")
    
    # Ensure selected controls are valid
    invalid_controls = [control_id for control_id in selected_controls if not any(control.id == control_id for control in controls)]
    if invalid_controls:
        raise HTTPException(status_code=400, detail=f"Invalid controls: {', '.join(map(str, invalid_controls))}")

    result_data = []
    results_folder = str(uuid.uuid4())  # Generate a unique folder name for results

    for control in controls:
        if control.id in selected_controls:
            # Create a temporary file path
            temp_file = f"/tmp/{str(uuid.uuid4())}.rb"

            # Write the control's InSpec code to a temp file
            with open(temp_file, "w") as f:
                f.write(control.code)

            # Command to execute the InSpec control
            command = f"inspec exec {temp_file} --reporter json"

            try:
                # Run the command and capture the output
                process = subprocess.run(command, shell=True, check=True, capture_output=True)
                result_json = process.stdout.decode('utf-8')
            except subprocess.CalledProcessError as e:
                raise HTTPException(status_code=500, detail=f"Error executing control: {e}")

            # Store the result in the database
            result_entry = ResultCreate(
                profile_id=profile_id,
                control_id=control.id,
                result=result_json,
                results_folder=results_folder
            )
            result_data.append(result_entry)

            # Save the result to the database
            db_result = ResultModel(**result_entry.dict())
            db.add(db_result)
            db.commit()

    return {"results": result_data, "results_folder": results_folder}

@router.get("/results/{folder_name}/{file_name}")
async def get_result(folder_name: str, file_name: str, db: Session = Depends(get_db)):
    # Implement the logic to fetch and return the result file
    # This is a placeholder implementation
    result = db.query(ResultModel).filter(ResultModel.results_folder == folder_name).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return {"content": "Result file content"}  # Replace with actual file content

@router.get("/list_files/{folder_name}")
async def list_files(folder_name: str):
    # Implement the logic to list files in the results folder
    # This is a placeholder implementation
    return ["result1.json", "result2.json"]  # Replace with actual file list