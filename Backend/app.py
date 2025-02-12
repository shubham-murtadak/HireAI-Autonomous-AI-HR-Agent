import os
import json 
import uvicorn
from bson import json_util
from dotenv import load_dotenv
from pydantic import BaseModel
from bson.objectid import ObjectId
from fastapi import FastAPI, Form, UploadFile,HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from Utils.chat import chatbot
from Utils.post_job import post_job_function
from Utils.apply_job import apply_job_function
from Utils.database import jobs_collection,applications_collection

load_dotenv()


#create fastapi instance
app = FastAPI()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
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
    """
    * method: get_chat_response
    * description: Processes the incoming chat request, uses the chatbot to generate a response based on the provided question, and returns the response in JSON format.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    *
    * Parameters
    *  request: The request object containing the user's question.
    """

    try:
        response = chatbot(request.question)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
#get jobs endpoint
@app.get("/getjobs")
async def get_all_jobs():
    """
    * method: get_all_jobs
    * description: Retrieves a list of all posted jobs from the database and returns them as a JSON response On Frontend.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    *
    * Parameters
    *   None
    """

    try:
        jobs_cursor = jobs_collection.find({})
        jobs = list(jobs_cursor)
        print("jobs :",jobs)
        # Convert ObjectId to string for JSON serialization
        jobs = json.loads(json_util.dumps(jobs))
        return JSONResponse(content=jobs)
    except Exception as e:
        print("Error fetching jobs:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")
    
# Endpoint to get jobs by HR ID
@app.get("/getjobsbyhr/{hr_id}")
async def get_jobs_by_hr(hr_id: str):
    """
    * method: get_jobs_by_hr
    * description: Fetches jobs posted by a specific HR based on hr_id.
    * return: JSONResponse
    *  who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       1-Feb-2025       1.0      initial creation
    *
    * Parameters:
    *  hr_id: str
    """
    try:
        # Fetch jobs by hr_id
        jobs_cursor = jobs_collection.find({"hr_id": hr_id})
        jobs = list(jobs_cursor)
        if not jobs:
            return JSONResponse(content={"message": "No jobs found for this HR"}, status_code=404)
        
        print("jobs found by hr are :",jobs)
        # Convert ObjectId to string for JSON serialization
        jobs = json.loads(json_util.dumps(jobs))
        return JSONResponse(content=jobs)
    
    except Exception as e:
        print("Error fetching jobs by HR:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch jobs by HR")
    

# Endpoint to get jobs by HR ID
@app.get("/getcandidatesbyjob/{job_id}")
async def get_candidates_by_jobid(job_id: str):
    """
    * method: get_candidates_by_jobid
    * description: Fetches candidates applied to a specific job id .
    * return: JSONResponse
    *  who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       1-Feb-2025       1.0      initial creation
    *
    * Parameters:
    *  job_id: str
    """
    try:
        print("Inside candidate search function !!!")
        # Fetch jobs by hr_id
        candidates_cursor = applications_collection.find({"job_id": job_id})
        candidates = list(candidates_cursor)
        print("candidates are :",candidates)
        if not candidates:
            return JSONResponse(content={"message": "No candidates found for this job"}, status_code=404)
        
        print("candidates found by job are :",candidates)
        # Convert ObjectId to string for JSON serialization
        candidates = json.loads(json_util.dumps(candidates))
        return JSONResponse(content=candidates)
    
    except Exception as e:
        print("Error fetching candidates by job:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch candidates by job")
    
    
#post job endpoint
@app.post("/job-post/{hr_id}")
async def post_job(hr_id:str,title: str = Form(...), description: str = Form(...),location: str = Form(...),company: str = Form(...)):
    """
    * method: post_job
    * description: Handles job posting requests by accepting job title, description, location, and company details. It validates the input and stores the job data in the database.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    *
    * Parameters
    *   title: The title of the job position.
    *   description: A detailed description of the job responsibilities and requirements.
    *   location: The location of the job.
    *   company: The company offering the job.
    """

    try:
        return await post_job_function(hr_id,title, description, location, company)
    except Exception as e:
        print("Error posting job:", e)


#apply job endpoint
@app.post("/apply-job/{job_id}")
async def apply_job(job_id: str,candidate_name: str = Form(...),email: str = Form(...),resume: UploadFile = None):
    """
    * method: apply_job
    * description: Handles job application requests by accepting job ID, candidate name, email, and an optional resume. It validates the job ID, processes the application, and stores the application data.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    *
    * Parameters
    *   job_id: The unique identifier for the job the candidate is applying to.
    *   candidate_name: The name of the candidate applying for the job.
    *   email: The email address of the candidate.
    *   resume (optional): The resume file of the candidate.
    """
    print(job_id,candidate_name)
    # Validate job_id to be a valid ObjectId string
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID format")

    try:
        return await apply_job_function(job_id, candidate_name, email,resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to apply for the job")




if __name__=='__main__':
    uvicorn.run('app:app',host='0.0.0.0',port=8000)