from bson import ObjectId
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from Utils.database import jobs_collection

async def post_job_function(hr_id: str, title: str, skills: str, experience: str, employmentType: str, description: str, location: str, company: str):
    """
    * method: post_job_function
    * description: Handles job posting by accepting job details, saving them to the database, and returning the posted job information along with a generated job ID.
    * return: JSONResponse
    *
    * who             when            version  change
    * ----------      -----------     -------  ------------------------------
    * Shubham M       31-JAN-2025     1.0      initial creation
    * Shubham M       16-FEB-2025     1.1      Added skills, experience, and employmentType fields
    *
    * Parameters
    *   title: The title of the job.
    *   skills: Required skills for the job (comma-separated).
    *   experience: Required experience in years.
    *   employmentType: The type of employment (Full-time, Part-time, etc.).
    *   description: A description of the job responsibilities and requirements.
    *   location: The location where the job is offered.
    *   company: The name of the company posting the job.
    """

    try:
        print("Inside post job function !!!")

        # Convert skills from comma-separated string to a list
        skills_list = [s.strip() for s in skills.split(",")]

        job_data = {
            "hr_id": hr_id,
            "title": title,
            "skills": skills_list,  # Store as a list
            "experience": experience,
            "employmentType": employmentType,
            "description": description,
            "location": location,
            "company": company,
        }

        print("Received job data:", job_data)

        # Save job to MongoDB
        result = jobs_collection.insert_one(job_data)
        job_id = str(result.inserted_id)

        # Include job_id as part of job_data
        job_data["_id"] = job_id

        print("Job data with ID:", job_data)

        return JSONResponse(content={
            "message": "Job posted successfully!",
            "job_id": job_id,
            "job_details": job_data
        })

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Failed to post the job")


if __name__ == '__main__':
    pass
