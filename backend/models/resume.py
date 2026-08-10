from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Resume(Base):

    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    file_path = Column(String(255))

    ats_score = Column(Integer)

    resume_score = Column(Integer)

    detected_skills = Column(Text)

    missing_skills = Column(Text)

    projects = Column(Text)

    courses = Column(Text)

    summary = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resume")