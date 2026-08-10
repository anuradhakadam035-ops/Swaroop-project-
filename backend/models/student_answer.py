"""
=========================================
Student Answer Model
=========================================
"""

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from database import Base


class StudentAnswer(Base):

    __tablename__ = "student_answers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    question_id = Column(
        Integer,
        ForeignKey("assessment_questions.id"),
        nullable=False
    )

    selected_answer = Column(
        String(1),
        nullable=False
    )

    is_correct = Column(
        String(10),
        nullable=False
    )

    submitted_at = Column(
        DateTime,
        server_default=func.now()
    )