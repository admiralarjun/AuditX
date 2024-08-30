
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from db import SessionLocal
from models.result import Result as ResultModel
from schemas.result import ResultCreate, ResultRead
from models.control import Control as ControlModel
import subprocess
import uuid
import json
import tempfile
import os  
import os

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

@router.post("/execute_controls/{profile_id}")
async def execute_controls(profile_id: int, request: Request, db: Session = Depends(get_db)):
    try:
        # Print the request body
        body = await request.json()
        print(f"Received request body: {body}")

        # Fetch the selected_controls list from the request body
        selected_controls = body.get('selected_controls', [])
        
        # Fetch controls from the database for the given profile
        controls = db.query(ControlModel).filter(ControlModel.profile_id == profile_id).all()

        if not controls:
            raise HTTPException(status_code=404, detail="No controls found for this profile")
        
        # Ensure selected controls are valid
        invalid_controls = [control_id for control_id in selected_controls if not any(control.id == control_id for control in controls)]
        if invalid_controls:
            raise HTTPException(status_code=400, detail=f"Invalid controls: {', '.join(map(str, invalid_controls))}")

        result_data = []

        for control in controls:
            if control.id in selected_controls:
                # Create a temporary file to write the InSpec code
                with tempfile.NamedTemporaryFile(suffix=".rb", delete=False) as temp_file:
                    temp_file.write(control.code.encode('utf-8'))
                    temp_file_path = temp_file.name

                # Command to execute the InSpec control
                command = f"inspec exec {temp_file_path} --reporter json"

                try:
                    # Run the command and capture the output
                    process = subprocess.run(command, shell=True, capture_output=True, text=True)
                    
                    # Parse the JSON output
                    result_json = json.loads(process.stdout)

                    # Extract fields from the JSON result (you may need to adjust this based on actual output structure)
                    result = Result(
                        profile_id=profile_id,
                        status=result_json.get("status", "unknown"),
                        code_desc=result_json.get("code_desc", ""),
                        run_time=result_json.get("run_time", 0.0),
                        start_time=result_json.get("start_time", None),
                        total_controls=result_json.get("total_controls", 0),
                        passed_controls=result_json.get("passed_controls", 0),
                        failed_controls=result_json.get("failed_controls", 0),
                        message=result_json.get("message", ""),
                        resource_class=result_json.get("resource_class", ""),
                        resource_params=result_json.get("resource_params", ""),
                        resource_id=result_json.get("resource_id", "")
                    )
                    
                    # Save the result to the database
                    db.add(result)
                    db.commit()
                    db.refresh(result)

                    result_data.append(result)
                    
                except subprocess.CalledProcessError as e:
                    # Capture stdout even if the command failed (non-zero exit code)
                    print(f"Error executing control {control.id}: {e}")
                    result_json = json.loads(e.stdout)
                    
                    # Store the error details
                    result = Result(
                        profile_id=profile_id,
                        status="error",
                        message=result_json.get("message", str(e))
                    )
                    
                    db.add(result)
                    db.commit()
                    db.refresh(result)

                    result_data.append(result)
                
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Unexpected error executing control {control.id}: {str(e)}")
                
                finally:
                    # Ensure the temporary file is deleted
                    try:
                        os.remove(temp_file_path)
                    except Exception as e:
                        print(f"Failed to delete temporary file {temp_file_path}: {str(e)}")

        return {"results": result_data}

    except HTTPException as http_exc:
        print(f"HTTPException: {http_exc}")
        raise http_exc
    except Exception as exc:
        print(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {exc}")