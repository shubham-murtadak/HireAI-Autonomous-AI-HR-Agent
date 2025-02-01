import os
from bson import ObjectId
from json import JSONEncoder
from fastapi.responses import JSONResponse
from fastapi import UploadFile, HTTPException
from Utils.database import jobs_collection, applications_collection



UPLOAD_FOLDER = "upload"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Custom encoder to handle ObjectId
class CustomJSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o) 
        return super().default(o)


async def apply_job_function(job_id: str, candidate_name: str, email: str, resume: UploadFile = None):
    """
    * method: apply_job_function
    * description: Handles job application submissions, validates job details, saves the resume if provided, and stores application data in the database.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    *
    * Parameters
    *   job_id: The unique identifier of the job.
    *   candidate_name: The name of the candidate.
    *   email: The email address of the candidate.
    *   resume: The resume file of the candidate .
    """

    try:
        print("inside apply job function ::")
        
        job = jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        file_path = None
        if resume:
            resume_filename = resume.filename
            file_path = os.path.join(UPLOAD_FOLDER, resume_filename)
            with open(file_path, "wb") as f:
                f.write(await resume.read())

        # Convert job_id to string
        job_id = str(job["_id"]) 

        print("job id is :", job_id)

        application_data = {
            "job_id": job_id, 
            "candidate_name": candidate_name,
            "email": email,
            "resume_path": file_path
        }

        # Save application to database
        applications_collection.insert_one(application_data)

        return JSONResponse(content=CustomJSONEncoder().encode({
            "message": "Application submitted successfully!",
            "application_details": application_data
        }))

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Failed to apply for the job")



if __name__=='__main__':
    pass