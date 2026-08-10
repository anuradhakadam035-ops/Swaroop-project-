from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from database import Base


class Course(Base):

    __tablename__ = "courses"

    # =========================================
    # PRIMARY KEY
    # =========================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =========================================
    # COURSE INFORMATION
    # =========================================

    title = Column(
        String(200),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=True
    )

    level = Column(
        String(50),
        nullable=True
    )

    duration = Column(
        String(100),
        nullable=True
    )

    rating = Column(
        Float,
        nullable=True
    )

    instructor = Column(
        String(150),
        nullable=True
    )

    # =========================================
    # COURSE LINK
    # =========================================

    course_link = Column(
        String(500),
        nullable=True
    )

    # =========================================
    # DESCRIPTION
    # =========================================

    description = Column(
        Text,
        nullable=True
    )

    # =========================================
    # TIMESTAMPS
    # =========================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    def __repr__(self):

        return f"<Course {self.title}>"