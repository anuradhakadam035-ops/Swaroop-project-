from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database import get_db

from models.job import Job

from schemas.job import (
    JobCreate,
    JobResponse
)

from security.admin_auth import get_current_admin


router = APIRouter(
    prefix="/api/admin/jobs",
    tags=["Admin - Jobs"]
)


# ==========================================
# GET ALL JOBS
# ==========================================

@router.get("")
def get_jobs(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    jobs = db.query(Job).order_by(
        Job.id.desc()
    ).all()

    return {

        "success": True,

        "total": len(jobs),

        "jobs": jobs

    }


# ==========================================
# GET SINGLE JOB
# ==========================================

@router.get("/{job_id}")
def get_job(
    job_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {

        "success": True,

        "job": job

    }


# ==========================================
# ADD JOB
# ==========================================

@router.post("")
def add_job(
    data: JobCreate,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    job = Job(

        title=data.title,

        company=data.company,

        location=data.location,

        experience=data.experience,

        salary=data.salary,

        skills=data.skills,

        link=data.link,

        career=data.career,

        job_type=data.job_type,

        work_mode=data.work_mode

    )

    db.add(job)

    db.commit()

    db.refresh(job)

    return {

        "success": True,

        "message": "Job added successfully",

        "job": job

    }


# ==========================================
# UPDATE JOB
# ==========================================

@router.put("/{job_id}")
def update_job(
    job_id: int,

    data: JobCreate,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )


    job.title = data.title

    job.company = data.company

    job.location = data.location

    job.experience = data.experience

    job.salary = data.salary

    job.skills = data.skills

    job.link = data.link

    job.career = data.career

    job.job_type = data.job_type

    job.work_mode = data.work_mode


    db.commit()

    db.refresh(job)


    return {

        "success": True,

        "message": "Job updated successfully",

        "job": job

    }


# ==========================================
# DELETE JOB
# ==========================================

@router.delete("/{job_id}")
def delete_job(
    job_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )


    db.delete(job)

    db.commit()


    return {

        "success": True,

        "message": "Job deleted successfully"

    }