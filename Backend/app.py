import os
import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI, Form, UploadFile,HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from Utils.chat import chatbot
# from fastapi.exception_handlers import HTTP

app = FastAPI()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with the frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# request body model
class ChatRequest(BaseModel):
    question: str



# Create the 'upload' directory if it doesn't exist
UPLOAD_FOLDER = "upload"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)



# chat endpoint
@app.post("/chat/")
async def get_chat_response(request: ChatRequest):
    try:
        # Use the session ID to manage chat history
        response = chatbot(request.question)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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