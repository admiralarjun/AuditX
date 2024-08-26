from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import base64
import subprocess
import uuid
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from copilot import router as copilot_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to match your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(copilot_router, prefix="/copilot")

controls_dir = "./controls"
results_dir = "./results"

# Ensure results directory exists
os.makedirs(results_dir, exist_ok=True)

class ExecuteControlsRequest(BaseModel):
    controls: list[str]

class ControlFileResponse(BaseModel):
    code: str

class UpdateControlFileRequest(BaseModel):
    code: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_profiles")
async def get_profiles():
    profiles = []
    for root, dirs, files in os.walk(controls_dir):
        for directory in dirs:
            profiles.append(directory)
        break
    return {"profiles": profiles}

@app.get("/get_controls/{profile_name}")
async def get_controls(profile_name: str):
    profile_path = os.path.join(controls_dir, profile_name)
    if not os.path.exists(profile_path) or not os.path.isdir(profile_path):
        raise HTTPException(status_code=404, detail="Profile not found")

    controls = [file for file in os.listdir(profile_path) if file.endswith(".rb")]
    if not controls:
        return {"message": f"No controls found in profile {profile_name}"}
    
    return {"profile": profile_name, "controls": controls}

@app.post("/execute_controls/{profile_name}")
async def execute_controls(profile_name: str, request: Request):
    profile_path = os.path.join(controls_dir, profile_name)
    if not os.path.exists(profile_path) or not os.path.isdir(profile_path):
        raise HTTPException(status_code=404, detail="Profile not found")

    controls = [file for file in os.listdir(profile_path) if file.endswith(".rb")]
    if not controls:
        raise HTTPException(status_code=404, detail="No controls found for this profile")

    try:
        body = await request.json()
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid JSON")

    selected_controls = body.get('controls', [])
    print(">>>>>",selected_controls)
    if not selected_controls:
        raise HTTPException(status_code=400, detail="No controls selected")

    invalid_controls = [control for control in selected_controls if control not in controls]
    if invalid_controls:
        raise HTTPException(status_code=400, detail=f"Invalid controls: {', '.join(invalid_controls)}")

    # Create a unique folder for the results
    results_folder = os.path.join(results_dir, str(uuid.uuid4()))
    os.makedirs(results_folder, exist_ok=True)

    for control in selected_controls:
        if control in controls:
            control_path = os.path.join(profile_path, control)
            result_file = os.path.join(results_folder, f"{os.path.basename(control)}.json")
            command = f"inspec exec {control_path} --reporter json:{result_file}"

            try:
                subprocess.run(command, shell=True, check=True)
            except subprocess.CalledProcessError:
                pass

    return {"results_folder": os.path.basename(results_folder)}

@app.get("/list_files/{folder_name}")
async def list_files(folder_name: str):
    folder_path = os.path.join(results_dir, folder_name)
    if not os.path.exists(folder_path) or not os.path.isdir(folder_path):
        raise HTTPException(status_code=404, detail="Folder not found")

    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    return files

@app.get("/results/{folder_name}/{file_name}")
async def get_result(folder_name: str, file_name: str):
    file_path = os.path.join(results_dir, folder_name, file_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Result file not found")
    return FileResponse(file_path, media_type='application/json')


@app.get("/controls/{profile}/files/{control}", response_model=ControlFileResponse)
async def get_control_file(profile: str, control: str):
    # Construct the file path
    file_path = os.path.join(controls_dir, profile, f"{control}")
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # Read the content of the file
        with open(file_path, 'r') as file:
            code = file.read()
        return ControlFileResponse(code=code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.put("/controls/{profile}/files/{control}", response_model=UpdateControlFileRequest)
async def update_control_file(profile: str, control: str, request: UpdateControlFileRequest):
    file_path = os.path.join(controls_dir, profile, f"{control}")
    print(">>>",file_path)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        decoded_code = base64.b64decode(request.code).decode('utf-8')
        with open(file_path, 'w') as file:
            file.write(decoded_code)
        return ControlFileResponse(code=decoded_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))