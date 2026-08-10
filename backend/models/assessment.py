from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from database import Base

class Assessment(Base):

    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    score = Column(Integer)

    career = Column(String(100))

    career_match = Column(Integer)

    strengths = Column(String(500))

    skill_gap = Column(String(500))

    summary = Column(String(1000))

    created_at = Column(DateTime, default=datetime.utcnow)