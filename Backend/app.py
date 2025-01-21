import os
import uvicorn
from fastapi import FastAPI, Form, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with the frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Create the 'upload' directory if it doesn't exist
UPLOAD_FOLDER = "upload"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/job-post")
async def post_job(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    company: str = Form(...),
    resume: UploadFile = None
):
    try:
        if resume:
            # Use the original file name for saving
            resume_filename = resume.filename
            file_path = os.path.join(UPLOAD_FOLDER, resume_filename)

            # Save the resume file
            with open(file_path, "wb") as f:
                f.write(await resume.read())
        else:
            resume_filename = "No file uploaded"

        # Debug information
        print("Job Details:")
        print(f"Title: {title}, Description: {description}, Location: {location}, Company: {company}")
        print(f"Resume Saved as: {resume_filename}")

        return JSONResponse(content={
            "message": "Job posted successfully!",
            "job_details": {
                "title": title,
                "description": description,
                "location": location,
                "company": company,
                "resume_filename": resume_filename
            }
        })
    except Exception as e:
        print("Error:", e)
        return JSONResponse(content={"error": "Failed to post the job"}, status_code=500)



if __name__=='__main__':
    uvicorn.run('app:app',host='0.0.0.0',port=8000)