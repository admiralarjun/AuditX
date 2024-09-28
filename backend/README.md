nafi - sqlite, schemas, models, fastapi
sid - ssh
arjun - report
pranavi - cis windows pdf -> control -> chef inspec based .rb control = ask for chef inspec ruby code chatgpt local audit control file in backend control folder (5 controls for 8 things)

# FastAPI Backend

Version: 0.1.0
OpenAPI Specification: 3.1
OpenAPI JSON: `/openapi.json`

## API Endpoints

### Copilot

- `POST /copilot/GENERATE_CODE`: Generate Code
- `POST /copilot/ANALYZE_CODE`: Analyze Code
- `POST /copilot/EXPLAIN`: Explain Code

### Platforms

- `GET /platforms/`: Get All Platforms
- `POST /platforms/`: Create Platform
- `GET /platforms/{platform_id}`: Read Platform
- `PUT /platforms/{platform_id}`: Update Platform
- `DELETE /platforms/{platform_id}`: Delete Platform

### Profiles

- `POST /profiles/`: Create Profile
- `GET /profiles/`: Read Profiles
- `GET /profiles/{profile_id}`: Read Profile
- `PUT /profiles/{profile_id}`: Update Profile
- `DELETE /profiles/{profile_id}`: Delete Profile

### Attributes

- `POST /attributes/`: Create Attribute
- `GET /attributes/{attribute_id}`: Read Attribute

### Controls

- `POST /controls/`: Create Control
- `GET /controls/`: Read Controls
- `GET /controls/profile/{profile_id}`: Read Controls By Profile
- `GET /controls/{id}`: Read Control
- `PUT /controls/{id}`: Update Control
- `DELETE /controls/{id}`: Delete Control

### Tags

- `POST /tags/`: Create Tag
- `GET /tags/{tag_id}`: Read Tag

### References

- `POST /references/`: Create Reference
- `GET /references/{reference_id}`: Read Reference

### Audits

- `POST /audits/`: Create Audit
- `GET /audits/{audit_id}`: Read Audit

### Results

- `GET /results/`: Read All Results
- `POST /results/`: Create Result
- `GET /results/{result_id}`: Read Result
- `PUT /results/{result_id}`: Update Result
- `DELETE /results/{result_id}`: Delete Result

### Execute Controls

- `POST /execute_controls/{profile_id}`: Execute Controls

### SSH Credentials

- `POST /ssh_creds/`: Create SSH Credentials
- `GET /ssh_creds/`: Read All SSH Credentials
- `GET /ssh_creds/{ssh_creds_id}`: Read SSH Credentials
- `PUT /ssh_creds/{ssh_creds_id}`: Update SSH Credentials
- `DELETE /ssh_creds/{ssh_creds_id}`: Delete SSH Credentials

### CIS PDFs

- `POST /cis_pdfs/`: Create CIS PDF
- `GET /cis_pdfs/`: List CIS PDFs
- `GET /cis_pdfs/{cis_pdf_id}`: Read CIS PDF
- `PUT /cis_pdfs/{cis_pdf_id}`: Update CIS PDF
- `DELETE /cis_pdfs/{cis_pdf_id}`: Delete CIS PDF

## Running the Application

1. Activate the virtual environment:

   ```
   pipenv shell
   ```

2. Install dependencies:

   ```
   pipenv install
   ```

3. Start the FastAPI server with hot-reloading:
   ```
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000` by default.
