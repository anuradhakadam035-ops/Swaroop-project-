from fastapi import APIRouter

from schemas.interview import InterviewAnswer

from services.interview_ai import evaluate_answer

router = APIRouter(

    prefix="/api/interview",

    tags=["Interview"]

)

questions = {

    "AI Engineer":[

        "Explain Machine Learning.",

        "Difference between AI and Deep Learning?",

        "What is Overfitting?",

        "Explain Neural Networks.",

        "What is Gradient Descent?"

    ],

    "Web Developer":[

        "What is REST API?",

        "Difference between GET and POST?",

        "Explain JavaScript Promises.",

        "What is React?",

        "Difference between SQL and NoSQL?"

    ]

}


@router.get("/{career}")

def get_questions(career:str):

    return {

        "career":career,

        "questions":questions.get(career, [])

    }


@router.post("/evaluate")

def evaluate(data:InterviewAnswer):

    return evaluate_answer(

        data.career,

        data.question,

        data.answer

    )