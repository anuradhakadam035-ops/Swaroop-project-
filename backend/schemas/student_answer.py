"""
=========================================
Student Answer Schema
=========================================
"""

from pydantic import BaseModel


class AnswerItem(BaseModel):

    question_id: int

    selected_answer: str


class AssessmentSubmit(BaseModel):

    user_id: int

    answers: list[AnswerItem]