from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import JSON

from database import Base


class Job(Base):

    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(150),
        nullable=False
    )

    company = Column(
        String(150),
        nullable=False
    )

    location = Column(
        String(150),
        nullable=False
    )

    experience = Column(
        String(100),
        nullable=False
    )

    salary = Column(
        String(100),
        nullable=False
    )

    skills = Column(
        JSON,
        nullable=False
    )

    link = Column(
        Text,
        nullable=False
    )

    career = Column(
        String(150),
        nullable=False
    )

    job_type = Column(
        String(50),
        default="Full Time"
    )

    work_mode = Column(
        String(50),
        default="Hybrid"
    )