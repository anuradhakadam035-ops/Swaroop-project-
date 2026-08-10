from pydantic import BaseModel
from typing import Optional


class CourseBase(BaseModel):

    title: str

    category: Optional[str] = None

    level: Optional[str] = None

    duration: Optional[str] = None

    rating: Optional[float] = None

    instructor: Optional[str] = None

    course_link: Optional[str] = None

    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):

    title: Optional[str] = None

    category: Optional[str] = None

    level: Optional[str] = None

    duration: Optional[str] = None

    rating: Optional[float] = None

    instructor: Optional[str] = None

    course_link: Optional[str] = None

    description: Optional[str] = None


class CourseResponse(CourseBase):

    id: int

    class Config:

        from_attributes = True