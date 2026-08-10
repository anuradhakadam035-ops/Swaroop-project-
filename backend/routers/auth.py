from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.auth import RegisterSchema, LoginSchema

from security.auth import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# ==========================================
# Register
# ==========================================

@router.post("/register")
def register(
    user: RegisterSchema,
    db: Session = Depends(get_db)
):

    # Email already exists
    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Mobile already exists
    existing_mobile = db.query(User).filter(
        User.mobile == user.mobile
    ).first()

    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        mobile=user.mobile,
        college=user.college,
        branch=user.branch,
        year=user.year,
        skills=user.skills,
        interests=user.interests,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Registration Successful"
    }


# ==========================================
# Login
# ==========================================

@router.post("/login")
def login(
    user: LoginSchema,
    db: Session = Depends(get_db)
):

    print("\n========== LOGIN ==========")
    print("Email Entered :", user.email)

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    print("User Found :", db_user)

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    print("Entered Password :", user.password)
    print("Stored Password  :", db_user.password)

    password_ok = verify_password(
        user.password,
        db_user.password
    )

    print("Password Match :", password_ok)

    if not password_ok:
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    token = create_access_token(
        {
            "sub": str(db_user.id)
        }
    )
    print("NEW TOKEN:", token)
    print("Login Successful")
    print("===========================\n")

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.full_name,
            "email": db_user.email,
            "role": "student"
        }
    }