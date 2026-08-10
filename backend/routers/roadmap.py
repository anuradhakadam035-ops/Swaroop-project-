from fastapi import APIRouter

router = APIRouter(
    prefix="/api/roadmap",
    tags=["Career Roadmap"]
)

@router.get("/{user_id}")
def get_roadmap(user_id: int):

    return {

        "career": "AI Engineer",

        "overall_progress": 35,

        "roadmap": [

            {
                "month": "Month 1",
                "title": "Advanced Python",
                "description": "Master Python programming, OOP concepts, file handling and advanced libraries.",
                "status": "completed",
                "resources": [
                    "Python Official",
                    "LeetCode",
                    "GeeksforGeeks"
                ]
            },

            {
                "month": "Month 2",
                "title": "SQL & Database",
                "description": "Learn MySQL, joins, indexing and database optimization.",
                "status": "current",
                "resources": [
                    "SQLBolt",
                    "MySQL Docs",
                    "W3Schools"
                ]
            },

            {
                "month": "Month 3",
                "title": "Machine Learning",
                "description": "Start ML algorithms, Scikit-Learn and regression models.",
                "status": "locked",
                "resources": [
                    "Coursera",
                    "Kaggle"
                ]
            },

            {
                "month": "Month 4",
                "title": "Deep Learning",
                "description": "CNN, RNN, TensorFlow and PyTorch fundamentals.",
                "status": "locked",
                "resources": [
                    "DeepLearning.ai",
                    "TensorFlow"
                ]
            },

            {
                "month": "Month 5",
                "title": "Real World AI Projects",
                "description": "Build 3 production-ready AI applications.",
                "status": "locked",
                "resources": [
                    "GitHub",
                    "HuggingFace"
                ]
            },

            {
                "month": "Month 6",
                "title": "Placement Preparation",
                "description": "Resume, interview, aptitude and coding preparation.",
                "status": "locked",
                "resources": [
                    "GeeksforGeeks",
                    "InterviewBit"
                ]
            }

        ]

    }