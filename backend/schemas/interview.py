from pydantic import BaseModel

class InterviewAnswer(BaseModel):

    career: str

    question: str

    answer: str