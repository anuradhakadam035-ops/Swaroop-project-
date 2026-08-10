from sqlalchemy import Column, Integer, String
from database import Base


class AssessmentQuestion(Base):

    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(String(1000))

    option_a = Column(String(500))

    option_b = Column(String(500))

    option_c = Column(String(500))

    option_d = Column(String(500))

    correct_answer = Column(String(5))

    category = Column(String(100))

    difficulty = Column(String(50))