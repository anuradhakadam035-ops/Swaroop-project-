from pydantic import BaseModel
from typing import Optional


class QuestionCreate(BaseModel):

    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str

    category: str

    difficulty: str


class QuestionUpdate(BaseModel):

    question: Optional[str] = None

    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None

    correct_answer: Optional[str] = None

    category: Optional[str] = None

    difficulty: Optional[str] = None