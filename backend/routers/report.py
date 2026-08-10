from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from security.auth import get_current_user

from models.user import User
from models.resume import Resume
from models.assessment_result import Assessment

router = APIRouter(
    prefix="/api/report",
    tags=["Career Report"]
)


@router.get("/")
def get_report(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    resume = db.query(Resume).filter(

        Resume.user_id == current_user.id

    ).order_by(

        Resume.id.desc()

    ).first()

    assessment = db.query(Assessment).filter(

        Assessment.user_id == current_user.id

    ).order_by(

        Assessment.id.desc()

    ).first()

    if not resume:

        raise HTTPException(

            status_code=404,

            detail="Resume not found."

        )

    if not assessment:

        raise HTTPException(

            status_code=404,

            detail="Assessment not found."

        )

    return {

        "student": {

            "name": current_user.full_name,

            "email": current_user.email,

            "college": current_user.college,

            "branch": current_user.branch,

            "year": current_user.year

        },

        "resume": {

            "resume_score": resume.resume_score,

            "ats_score": resume.ats_score,

            "skills": resume.detected_skills.split(","),

            "missing_skills": resume.missing_skills.split(","),

            "projects": resume.projects.split(","),

            "courses": resume.courses.split(","),

            "summary": resume.summary

        },

        "assessment": {

            "score": assessment.score

        },

        "career": {

            "career": assessment.career,

            "career_match": assessment.career_match,

            "strengths": assessment.strengths.split(","),

            "skill_gap": assessment.skill_gap.split(","),

            "summary": assessment.summary

        }

    }