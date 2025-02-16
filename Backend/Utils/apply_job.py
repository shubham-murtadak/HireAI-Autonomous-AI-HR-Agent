import os
from bson import ObjectId
from json import JSONEncoder
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from Utils.database import jobs_collection, applications_collection


# Custom encoder to handle ObjectId
class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o) 
        return super().default(o)


async def apply_job_function(job_id: str, candidate_name: str, email: str, phone_number: str, linkedin: str, experience: str, notice_period: str, expected_salary: str, resume_url: str):
    """
    * method: apply_job_function
    * description: Handles job application submissions, validates job details, and stores application data in the database.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    * Shubham M       16-FEB-2025     1.1      Removed resume file saving, added resume_url and additional fields
    *
    * Parameters
    *   job_id: The unique identifier of the job.
    *   candidate_name: The name of the candidate.
    *   email: The email address of the candidate.
    *   phone_number: The phone number of the candidate.
    *   linkedin: The LinkedIn profile URL of the candidate.
    *   experience: The experience level of the candidate.
    *   notice_period: The notice period of the candidate.
    *   expected_salary: The expected salary of the candidate.
    *   resume_url: The Firebase storage link of the candidate's resume.
    """

    try:
        print("inside apply job function ::")
        
        # Fetch the job details from the database
        job = jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Convert job_id to string
        job_id = str(job["_id"]) 

        print("job id is :", job_id)

        application_data = {
            "job_id": job_id, 
            "candidate_name": candidate_name,
            "email": email,
            "phone_number": phone_number,
            "linkedin": linkedin,
            "experience": experience,
            "notice_period": notice_period,
            "expected_salary": expected_salary,
            "resume_url": resume_url 
        }

        # Save application to database
        applications_collection.insert_one(application_data)

        return JSONResponse(content={
            "message": "Application submitted successfully!",
            "application_details": {
            "job_id": job_id, 
            "candidate_name": candidate_name,
            "email": email,
            "phone_number": phone_number,
            "linkedin": linkedin,
            "experience": experience,
            "notice_period": notice_period,
            "expected_salary": expected_salary,
            "resume_url": resume_url 
            }
        })

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Failed to apply for the job")


if __name__=='__main__':
    pass
