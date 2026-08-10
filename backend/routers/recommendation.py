from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from security.auth import get_current_user

router = APIRouter(
    prefix="/api/recommendation",
    tags=["Recommendation"]
)


@router.get("/")
def get_recommendation(

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Temporary Recommendation
    return {

        "career": current_user.career_match or "AI Engineer",

        "match": 92,

        "salary": "₹8 LPA - ₹20 LPA",

        "growth": "Very High",

        "demand": 5,

        "strengths": [

            "Python",

            "SQL",

            "Machine Learning"

        ],

        "skill_gap":[

            "Docker",

            "TensorFlow",

            "AWS"

        ],

        "courses":[

            "Machine Learning",

            "Docker",

            "AWS Practitioner"

        ],

        "roadmap":[

            "Python",

            "SQL",

            "Machine Learning",

            "Deep Learning",

            "Projects",

            "Internship"

        ]

    }