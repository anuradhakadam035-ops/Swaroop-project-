from fastapi import APIRouter

from services.ai_service import generate_career_recommendation

router = APIRouter(
    prefix="/api/ai",
    tags=["AI"]
)


@router.get("/recommendation")
def recommendation():

    student = {
        "name": "Sushil",
        "branch": "ENTC",
        "skills": "Python, HTML, SQL",
        "interests": "Artificial Intelligence",
        "score": 92
    }

    result = generate_career_recommendation(student)

    return {
        "success": True,
        **result
    }