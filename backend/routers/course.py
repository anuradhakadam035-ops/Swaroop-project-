from fastapi import APIRouter

router = APIRouter(
    prefix="/api/courses",
    tags=["Courses"]
)

@router.get("/{career}")
def get_courses(career: str):

    return [
        {
            "title": "Machine Learning Specialization",
            "provider": "Coursera",
            "rating": 4.9,
            "duration": "3 Months",
            "level": "Intermediate",
            "skills": [
                "Python",
                "Machine Learning",
                "Regression"
            ],
            "link": "https://coursera.org"
        }
    ]