from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database import get_db

from models.admin_course import Course

from schemas.admin_course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse
)

from security.admin_auth import get_current_admin


router = APIRouter(
    prefix="/api/admin/courses",
    tags=["Admin Courses"]
)


# =========================================================
# GET ALL COURSES
# =========================================================

@router.get(
    "",
    response_model=list[CourseResponse]
)
def get_courses(

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_admin
    )

):

    courses = (
        db.query(Course)
        .order_by(
            Course.id.desc()
        )
        .all()
    )

    return courses


# =========================================================
# GET SINGLE COURSE
# =========================================================

@router.get(
    "/{course_id}",
    response_model=CourseResponse
)
def get_course(

    course_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_admin
    )

):

    course = (
        db.query(Course)
        .filter(
            Course.id == course_id
        )
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course


# =========================================================
# CREATE COURSE
# =========================================================

@router.post(
    "",
    response_model=CourseResponse
)
def create_course(

    course: CourseCreate,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_admin
    )

):

    try:

        new_course = Course(

            title=course.title,

            category=course.category,

            level=course.level,

            duration=course.duration,

            rating=course.rating,

            instructor=course.instructor,

            course_link=course.course_link,

            description=course.description

        )

        db.add(new_course)

        db.commit()

        db.refresh(new_course)

        return new_course

    except Exception as e:

        db.rollback()

        print(
            "CREATE COURSE ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# UPDATE COURSE
# =========================================================

@router.put(
    "/{course_id}",
    response_model=CourseResponse
)
def update_course(

    course_id: int,

    course: CourseUpdate,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_admin
    )

):

    existing_course = (
        db.query(Course)
        .filter(
            Course.id == course_id
        )
        .first()
    )

    if not existing_course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )


    update_data = course.model_dump(
        exclude_unset=True
    )


    for key, value in update_data.items():

        setattr(
            existing_course,
            key,
            value
        )


    try:

        db.commit()

        db.refresh(
            existing_course
        )

        return existing_course

    except Exception as e:

        db.rollback()

        print(
            "UPDATE COURSE ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# DELETE COURSE
# =========================================================

@router.delete(
    "/{course_id}"
)
def delete_course(

    course_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_admin
    )

):

    course = (
        db.query(Course)
        .filter(
            Course.id == course_id
        )
        .first()
    )

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )


    course_name = course.title


    try:

        db.delete(course)

        db.commit()

        return {

            "message":
                "Course deleted successfully",

            "course_id":
                course_id,

            "course_name":
                course_name

        }

    except Exception as e:

        db.rollback()

        print(
            "DELETE COURSE ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )