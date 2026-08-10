"""
=========================================
User Model
AI Career Guidance System
=========================================
"""

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):

    __tablename__ = "users"

    # ==========================
    # Primary Key
    # ==========================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ==========================
    # Basic Information
    # ==========================

    full_name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    mobile = Column(
        String(15),
        unique=True,
        nullable=False
    )

    # ==========================
    # Education
    # ==========================

    college = Column(
        String(200),
        nullable=False
    )

    branch = Column(
        String(100),
        nullable=False
    )

    year = Column(
        String(30),
        nullable=False
    )

    # ==========================
    # Career Information
    # ==========================

    skills = Column(
        Text,
        nullable=True
    )

    interests = Column(
        Text,
        nullable=True
    )

    # ==========================
    # Authentication
    # ==========================

    password = Column(
        String(255),
        nullable=False
    )

    # ==========================
    # Profile
    # ==========================

    profile_photo = Column(
        String(255),
        nullable=True
    )

    # ==========================
    # Recommendation
    # ==========================

    career_match = Column(
        String(100),
        nullable=True
    )

    # ==========================
    # Time
    # ==========================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    resume = relationship(
        "Resume",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )

    def __repr__(self):

        return f"<User {self.full_name}>"