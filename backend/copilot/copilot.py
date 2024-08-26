from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import base64
import google.generativeai as genai
from .templates import COMPLIANCE_TEMPLATES
from dotenv import load_dotenv
import os

router = APIRouter()

# Load environment variables from .env file in the same directory
load_dotenv(dotenv_path=".env")

# Retrieve the API key from the environment
API_KEY = os.getenv('API_KEY')
if not API_KEY:
    raise RuntimeError("API key not found in environment variables")

# Configure the Google Generative AI model
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class CodeRequest(BaseModel):
    code: str
    description: str = ""  # Optional, for actions that need a description

def format_prompt(action: str, description: str, code: str) -> str:
    print(action,description,code,end="\n")
    template = COMPLIANCE_TEMPLATES.get(action)
    if not template:
        raise HTTPException(status_code=400, detail="Invalid action specified")
    return template.format(description=description, code=code)

def call_llm_api(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error calling LLM API") from e

@router.post("/GENERATE_CODE")
async def generate_code(request: CodeRequest):
    encoded_code = request.code
    try:
        control_code = base64.b64decode(encoded_code).decode('utf-8')
        prompt = format_prompt("GENERATE_CODE", request.description, control_code)
        response = call_llm_api(prompt)
        return {"response": response}
    except (base64.binascii.Error, UnicodeDecodeError) as e:
        raise HTTPException(status_code=400, detail="Invalid base64 encoding") from e
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error") from e

@router.post("/ANALYZE_CODE")
async def analyze_code(request: CodeRequest):
    encoded_code = request.code
    try:
        control_code = base64.b64decode(encoded_code).decode('utf-8')
        prompt = format_prompt("ANALYZE_CODE", request.description, control_code)
        response = call_llm_api(prompt)
        return {"response": response}
    except (base64.binascii.Error, UnicodeDecodeError) as e:
        raise HTTPException(status_code=400, detail="Invalid base64 encoding") from e
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error") from e

@router.post("/EXPLAIN")
async def explain_code(request: CodeRequest):
    encoded_code = request.code
    try:
        control_code = base64.b64decode(encoded_code).decode('utf-8')
        prompt = format_prompt("EXPLAIN", "", control_code)
        response = call_llm_api(prompt)
        return {"response": response}
    except (base64.binascii.Error, UnicodeDecodeError) as e:
        raise HTTPException(status_code=400, detail="Invalid base64 encoding") from e
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error") from e
