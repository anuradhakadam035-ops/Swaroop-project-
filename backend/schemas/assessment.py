from pydantic import BaseModel
from typing import List


class AssessmentAnswer(BaseModel):

    question_id: int

    selected_answer: str


class AssessmentSubmit(BaseModel):

    answers: List[AssessmentAnswer]


class AssessmentQuestionCreate(BaseModel):

    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str

    category: str

    difficulty: str


class AssessmentQuestionResponse(BaseModel):

    id: int

    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str

    category: str

    difficulty: str

    class Config:
        from_attributes = True