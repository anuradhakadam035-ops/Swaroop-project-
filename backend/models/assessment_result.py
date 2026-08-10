from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Text
from datetime import datetime
from database import Base

class Assessment(Base):

    __tablename__ = "assessment_result"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    score = Column(Integer)

    career = Column(String(100))

    career_match = Column(Integer)

    strengths = Column(String(1000))

    skill_gap = Column(String(1000))

    summary = Column(String(2000))

    roadmap = Column(Text,nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )