from fastapi import APIRouter

router = APIRouter(

    prefix="/api/analytics",

    tags=["Analytics"]

)

@router.get("/")

def analytics():

    return {

        "resume_score":92,

        "ats_score":88,

        "interview_score":84,

        "career_match":95,

        "skills":{

            "Python":90,

            "SQL":75,

            "AI":95,

            "Communication":80,

            "Java":70

        }

    }