from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from security.auth import get_current_user

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Resume Score (Temporary)
    resume_score = 0

    # Assessment Score (Temporary)
    assessment_score = 0

    # Progress
    progress = int((resume_score + assessment_score) / 2)

    return {

        "name": current_user.full_name,

        "photo": current_user.profile_photo,

        "career": current_user.career_match,

        "skills": current_user.skills,

        "resume_score": resume_score,

        "assessment_score": assessment_score,

        "progress": progress

    }