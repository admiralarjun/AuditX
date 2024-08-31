
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from db import SessionLocal
from models.result import Result as ResultModel
from schemas.result import ResultCreate, ResultRead
from models.control import Control as ControlModel
from models.ssh_creds import SSHCreds as SSHCredsModel
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

        # Fetch the selected_controls list from the request body
        selected_controls = body.get('selected_controls', [])
        selectedCredentialId = body.get('selectedCredentialId')
        selectedCredentialType = body.get('selectedCredentialType')
        print(f"Selected id and type and controls: {selectedCredentialId} - {selectedCredentialType} - {selected_controls}")
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
            if control.id not in selected_controls:
                continue
            if control.id in selected_controls:
                # Create a temporary file to write the InSpec code
                with tempfile.NamedTemporaryFile(suffix=".rb", delete=False) as temp_file:
                    temp_file.write(control.code.encode('utf-8'))
                    temp_file_path = temp_file.name


                if(selectedCredentialType == "ssh"):
                    ssh_creds = db.query(SSHCredsModel).filter(SSHCredsModel.id == selectedCredentialId).first()
                    if ssh_creds is None:
                        raise HTTPException(status_code=404, detail="SSH Credentials not found")
                    
                    ssh_target = f"{ssh_creds.ssh_username}@{ssh_creds.ssh_ip}"
                    if ssh_creds.ssh_pem_path:
                        ssh_command = f"-i {ssh_creds.ssh_pem_path}"
                    elif ssh_creds.ssh_password:
                        ssh_command = f"--password {ssh_creds.ssh_password}"
                    else:
                        raise HTTPException(status_code=400, detail="No valid authentication method provided")
                    
                    command = f"inspec exec {temp_file_path} -t ssh://{ssh_target} {ssh_command} --reporter json"
                else:
                    command = f"inspec exec {temp_file_path} --reporter json"

                print(f"Executing command: {command}")
                try:
                    # Run the command and capture the output
                    process = subprocess.run(command, shell=True, capture_output=True, text=True)
                    
                    # Get the JSON output
                    result_json = process.stdout

                    db_result = ResultModel(
                        profile_id=profile_id,
                        result_json=result_json  # Store the entire JSON output as a string
                    )
                    db.add(db_result)
                    db.commit()
                    db.refresh(db_result)

                    result_data.append(db_result)

                except subprocess.CalledProcessError as e:
                    # Capture stdout even if the command failed (non-zero exit code)
                    print(f"Error executing control {control.id}: {e}")
                    result_json = e.stdout

                    # Persist the result in the database
                    db_result = ResultModel(
                        profile_id=profile_id,
                        result_json=result_json  # Store the entire JSON output as a string
                    )
                    db.add(db_result)
                    db.commit()
                    db.refresh(db_result)

                    result_data.append(db_result)
                
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