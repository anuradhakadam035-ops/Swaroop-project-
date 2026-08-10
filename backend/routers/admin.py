from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm


from database import get_db

from models.admin import Admin
from models.user import User

from schemas.admin import (
    AdminCreate,
    AdminLogin
)

from security.admin_auth import (
    hash_password,
    verify_password,
    create_admin_token,
    get_current_admin
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# =========================================================
# ADMIN REGISTER SCHEMA
# =========================================================

# Already imported from schemas.admin
# AdminCreate
# AdminLogin


# =========================================================
# STUDENT CREATE SCHEMA
# =========================================================

class StudentCreate(BaseModel):

    full_name: str

    email: str

    mobile: str

    password: str

    college: str

    branch: str

    year: str

    skills: str | None = None

    interests: str | None = None


# =========================================================
# STUDENT UPDATE SCHEMA
# =========================================================

class StudentUpdate(BaseModel):

    full_name: str

    email: str

    mobile: str

    college: str

    branch: str

    year: str

    skills: str | None = None

    interests: str | None = None


# =========================================================
# ADMIN REGISTER
# =========================================================

@router.post("/register")
def register_admin(
    admin: AdminCreate,
    db: Session = Depends(get_db)
):

    try:

        existing_admin = db.query(Admin).filter(
            Admin.email == admin.email
        ).first()

        if existing_admin:

            raise HTTPException(
                status_code=400,
                detail="Admin with this email already exists"
            )


        hashed_password = hash_password(
            admin.password
        )


        new_admin = Admin(

            full_name=admin.full_name,

            email=admin.email,

            mobile=admin.mobile,

            hashed_password=hashed_password,

            role="admin"

        )


        db.add(new_admin)

        db.commit()

        db.refresh(new_admin)


        return {

            "message":
                "Admin registered successfully",

            "admin": {

                "id":
                    new_admin.id,

                "full_name":
                    new_admin.full_name,

                "email":
                    new_admin.email,

                "mobile":
                    new_admin.mobile,

                "role":
                    new_admin.role

            }

        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        print(
            "ADMIN REGISTER ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ADMIN LOGIN
# =========================================================

@router.post("/login")
def login_admin(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)

):

    try:

        # =================================================
        # OAuth2 uses "username"
        # We use it as admin email
        # =================================================

        email = form_data.username

        password = form_data.password


        # =================================================
        # FIND ADMIN
        # =================================================

        existing_admin = db.query(Admin).filter(

            Admin.email == email

        ).first()


        if not existing_admin:

            raise HTTPException(

                status_code=401,

                detail="Invalid email or password",

                headers={
                    "WWW-Authenticate": "Bearer"
                }

            )


        # =================================================
        # VERIFY PASSWORD
        # =================================================

        password_valid = verify_password(

            password,

            existing_admin.hashed_password

        )


        if not password_valid:

            raise HTTPException(

                status_code=401,

                detail="Invalid email or password",

                headers={
                    "WWW-Authenticate": "Bearer"
                }

            )


        # =================================================
        # CREATE JWT
        # =================================================

        token = create_admin_token(

            existing_admin.id

        )


        # =================================================
        # RESPONSE
        # =================================================

        return {

            "message":
                "Admin login successful",

            "access_token":
                token,

            "token_type":
                "bearer",

            "admin": {

                "id":
                    existing_admin.id,

                "full_name":
                    existing_admin.full_name,

                "email":
                    existing_admin.email,

                "mobile":
                    existing_admin.mobile,

                "role":
                    existing_admin.role

            }

        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "ADMIN LOGIN ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )

# =========================================================
# GET ALL STUDENTS
# =========================================================

@router.get("/students")
def get_students(

    db: Session = Depends(get_db),

    admin=Depends(get_current_admin)

):

    try:

        students = db.query(User).order_by(
            User.id.desc()
        ).all()


        return [

            {

                "id":
                    student.id,

                "full_name":
                    student.full_name,

                "email":
                    student.email,

                "mobile":
                    student.mobile,

                "college":
                    student.college,

                "branch":
                    student.branch,

                "year":
                    student.year,

                "skills":
                    student.skills,

                "interests":
                    student.interests,

                "career":
                    student.career_match

            }

            for student in students

        ]


    except Exception as e:

        print(
            "GET STUDENTS ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# ADD STUDENT
# =========================================================

@router.post("/students")
def create_student(

    student: StudentCreate,

    db: Session = Depends(get_db),

    admin=Depends(get_current_admin)

):

    try:

        # -------------------------------------------------
        # CHECK EMAIL
        # -------------------------------------------------

        existing_email = db.query(User).filter(
            User.email == student.email
        ).first()


        if existing_email:

            raise HTTPException(
                status_code=400,
                detail="Student with this email already exists"
            )


        # -------------------------------------------------
        # CHECK MOBILE
        # -------------------------------------------------

        existing_mobile = db.query(User).filter(
            User.mobile == student.mobile
        ).first()


        if existing_mobile:

            raise HTTPException(
                status_code=400,
                detail="Student with this mobile number already exists"
            )


        # -------------------------------------------------
        # HASH STUDENT PASSWORD
        # -------------------------------------------------

        hashed_password = hash_password(
            student.password
        )


        # -------------------------------------------------
        # CREATE STUDENT
        # -------------------------------------------------

        new_student = User(

            full_name=student.full_name,

            email=student.email,

            mobile=student.mobile,

            college=student.college,

            branch=student.branch,

            year=student.year,

            skills=student.skills,

            interests=student.interests,

            password=hashed_password

        )


        db.add(new_student)

        db.commit()

        db.refresh(new_student)


        return {

            "message":
                "Student registered successfully",

            "student": {

                "id":
                    new_student.id,

                "full_name":
                    new_student.full_name,

                "email":
                    new_student.email,

                "mobile":
                    new_student.mobile,

                "college":
                    new_student.college,

                "branch":
                    new_student.branch,

                "year":
                    new_student.year,

                "skills":
                    new_student.skills,

                "interests":
                    new_student.interests,

                "career":
                    new_student.career_match

            }

        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        print(
            "ADD STUDENT ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET SINGLE STUDENT
# =========================================================

@router.get("/student/{student_id}")
def get_student(

    student_id: int,

    db: Session = Depends(get_db),

    admin=Depends(get_current_admin)

):

    student = db.query(User).filter(
        User.id == student_id
    ).first()


    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )


    return {

        "id":
            student.id,

        "full_name":
            student.full_name,

        "name":
            student.full_name,

        "email":
            student.email,

        "mobile":
            student.mobile,

        "college":
            student.college,

        "branch":
            student.branch,

        "year":
            student.year,

        "skills":
            student.skills,

        "interests":
            student.interests,

        "career":
            student.career_match

    }


# =========================================================
# UPDATE STUDENT
# =========================================================

@router.put("/student/{student_id}")
def update_student(

    student_id: int,

    student_data: StudentUpdate,

    db: Session = Depends(get_db),

    admin=Depends(get_current_admin)

):

    student = db.query(User).filter(
        User.id == student_id
    ).first()


    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )


    # -------------------------------------------------
    # CHECK EMAIL USED BY ANOTHER STUDENT
    # -------------------------------------------------

    email_exists = db.query(User).filter(
        User.email == student_data.email,
        User.id != student_id
    ).first()


    if email_exists:

        raise HTTPException(
            status_code=400,
            detail="Email already belongs to another student"
        )


    # -------------------------------------------------
    # CHECK MOBILE USED BY ANOTHER STUDENT
    # -------------------------------------------------

    mobile_exists = db.query(User).filter(
        User.mobile == student_data.mobile,
        User.id != student_id
    ).first()


    if mobile_exists:

        raise HTTPException(
            status_code=400,
            detail="Mobile number already belongs to another student"
        )


    # -------------------------------------------------
    # UPDATE
    # -------------------------------------------------

    student.full_name = student_data.full_name

    student.email = student_data.email

    student.mobile = student_data.mobile

    student.college = student_data.college

    student.branch = student_data.branch

    student.year = student_data.year

    student.skills = student_data.skills

    student.interests = student_data.interests


    db.commit()

    db.refresh(student)


    return {

        "message":
            "Student updated successfully"

    }


# =========================================================
# DELETE STUDENT
# =========================================================

@router.delete("/student/{student_id}")
def delete_student(

    student_id: int,

    db: Session = Depends(get_db),

    admin=Depends(get_current_admin)

):

    student = db.query(User).filter(
        User.id == student_id
    ).first()


    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )


    db.delete(student)

    db.commit()


    return {

        "message":
            "Student deleted successfully"

    }