from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from security.admin_auth import get_current_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Students"]
)


# ============================================================
# GET ALL STUDENTS
# ============================================================

@router.get("/students")
def get_students(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):

    try:

        students = db.query(User).order_by(
            User.id.desc()
        ).all()

        return students

    except Exception as e:

        print("GET STUDENTS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.delete("/student/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    try:

        student = db.query(User).filter(
            User.id == student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        student_name = student.full_name

        db.delete(student)
        db.commit()

        return {
            "message": "Student deleted successfully",
            "student_id": student_id,
            "student_name": student_name
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        import traceback

        print("\n===================================")
        print("DELETE STUDENT ERROR")
        print("===================================")

        traceback.print_exc()

        print("ERROR TYPE:", type(e).__name__)
        print("ERROR MESSAGE:", str(e))

        print("===================================\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )